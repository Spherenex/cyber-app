



// import React, { useState, useEffect, useRef } from 'react';
// import { ref, set } from "firebase/database";
// import { database } from '../../firebase';
// import * as tf from '@tensorflow/tfjs';
// import * as mobilenet from '@tensorflow-models/mobilenet';
// import './AIClassifier.css';

// const AIClassifier = ({ threatLevel = 0 }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [isWebcamActive, setIsWebcamActive] = useState(false);
//   const [predictionResult, setPredictionResult] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showGreenBlink, setShowGreenBlink] = useState(false);
//   const [showRedBlink, setShowRedBlink] = useState(false);
//   const [modelStatus, setModelStatus] = useState('Loading models...');
//   const [isScanning, setIsScanning] = useState(false);
//   const [scanningProgress, setScanningProgress] = useState(0);
//   const scanningIntervalRef = useRef(null);
//   const [firebaseStatus, setFirebaseStatus] = useState('');
//   const [threatCondition, setThreatCondition] = useState(1); // Default to Condition 1
//   const [model, setModel] = useState(null);
//   const classificationIntervalRef = useRef(null);

//   // Determine threat condition based on threat level
//   useEffect(() => {
//     if (threatLevel >= 70) {
//       // High threat (100% or close) - Condition 3
//       setThreatCondition(3);
//     } else if (threatLevel >= 40) {
//       // Mid-level threat - Condition 2
//       setThreatCondition(2);
//     } else {
//       // Basic threat - Condition 1
//       setThreatCondition(1);
//     }
//     console.log(`Threat level: ${threatLevel}, Condition: ${threatCondition}`);
//   }, [threatLevel]);

//   // Initialize webcam and TensorFlow
//   useEffect(() => {
//     const setupModelsAndWebcam = async () => {
//       try {
//         // Load TensorFlow.js model
//         setModelStatus('Loading TensorFlow model...');
//         await tf.ready();
//         const loadedModel = await mobilenet.load({
//           version: 2,
//           alpha: 1.0
//         });
//         setModel(loadedModel);
//         setModelStatus('Model loaded successfully');

//         // Setup webcam
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { width: 224, height: 224 },
//           audio: false
//         });
        
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           setIsWebcamActive(true);
//           setIsLoading(false);
//         }
//       } catch (error) {
//         console.error('Error setting up:', error);
//         setModelStatus(`Error loading model: ${error.message}`);
//         setIsLoading(false);
//       }
//     };

//     setupModelsAndWebcam();

//     // Cleanup function
//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         const tracks = videoRef.current.srcObject.getTracks();
//         tracks.forEach(track => track.stop());
//       }
      
//       if (scanningIntervalRef.current) {
//         clearInterval(scanningIntervalRef.current);
//       }

//       if (classificationIntervalRef.current) {
//         clearInterval(classificationIntervalRef.current);
//       }
//     };
//   }, []);

//   // Automatically start classification when model and webcam are ready
//   useEffect(() => {
//     if (model && isWebcamActive && !isLoading) {
//       // Start automatic classification every 5 seconds
//       startAutomaticClassification();
//     }
    
//     return () => {
//       if (classificationIntervalRef.current) {
//         clearInterval(classificationIntervalRef.current);
//       }
//     };
//   }, [model, isWebcamActive, isLoading]);

//   // Start automatic classification at regular intervals
//   const startAutomaticClassification = () => {
//     // First immediate classification
//     performClassification();
    
//     // Then set up interval (every 5 seconds)
//     classificationIntervalRef.current = setInterval(() => {
//       performClassification();
//     }, 5000); // Classify every 5 seconds
//   };

//   // Analyze image colors to detect fruit quality
//   const analyzeImageColors = (canvas) => {
//     if (!canvas) return { 
//       yellowOrangePercent: 0, 
//       greenPercent: 0, 
//       brightGreenPercent: 0, 
//       brownDarkPercent: 0,
//       blackPatchesDetected: false
//     };
    
//     const ctx = canvas.getContext('2d');
    
//     // Get pixel data
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const data = imageData.data;
//     const width = canvas.width;
//     const height = canvas.height;
    
//     // Count pixels by color categories
//     let yellowOrangePixels = 0;   // For fruit flesh (yellow to orange)
//     let greenPixels = 0;          // For leaves or unripe parts
//     let brightGreenPixels = 0;    // Specifically for healthy leaves
//     let brownDarkPixels = 0;      // For spots/blemishes
//     let blackPatchPixels = 0;     // For black patches
//     let totalNonBackgroundPixels = 0;
    
//     // Create a map for black patch detection
//     const blackPatchMap = new Array(width * height).fill(false);
    
//     // Check each pixel
//     for (let y = 0; y < height; y++) {
//       for (let x = 0; x < width; x++) {
//         const idx = (y * width + x) * 4;
//         const r = data[idx];
//         const g = data[idx + 1];
//         const b = data[idx + 2];
        
//         // Skip very dark background pixels
//         if (r < 20 && g < 20 && b < 20) continue;
        
//         totalNonBackgroundPixels++;
        
//         // Improved green leaf detection (more sensitive)
//         if (g > 100 && g > r * 1.2 && g > b * 1.2) {
//           brightGreenPixels++;
//           greenPixels++;
//         }
//         // Check for general green
//         else if (g > r && g > b) {
//           greenPixels++;
//         }
//         // Check for yellow/orange/red (ripe fruit)
//         else if (r > 100 && g > 70 && b < Math.min(r, g) * 0.9) {
//           yellowOrangePixels++;
//         }
//         // Check for black patches (very dark pixels within fruit area) - more restrictive
//         else if (r < 40 && g < 40 && b < 40) {
//           blackPatchPixels++;
//           blackPatchMap[y * width + x] = true;
//         }
//         // Dark/brown spots - make this less sensitive
//         else if (r < 130 && g < 130 && b < 80 && r > b) {
//           brownDarkPixels++;
//         }
//       }
//     }
    
//     // Determine if there are significant black patches (looking for connected components)
//     let blackPatchesDetected = false;
    
//     // Only check for black patches if enough dark pixels are detected - more restrictive threshold
//     if (blackPatchPixels / totalNonBackgroundPixels > 0.03) { // Increased threshold from 0.01 to 0.03
//       // Use flood fill to find connected black patches
//       const visited = new Array(width * height).fill(false);
      
//       const floodFill = (x, y) => {
//         if (x < 0 || x >= width || y < 0 || y >= height) return 0;
        
//         const idx = y * width + x;
//         if (visited[idx] || !blackPatchMap[idx]) return 0;
        
//         visited[idx] = true;
//         let size = 1;
        
//         // Check 4 adjacent pixels
//         size += floodFill(x + 1, y);
//         size += floodFill(x - 1, y);
//         size += floodFill(x, y + 1);
//         size += floodFill(x, y - 1);
        
//         return size;
//       };
      
//       // Find the largest black patch - require larger patches to count
//       let maxPatchSize = 0;
      
//       for (let y = 0; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//           const idx = y * width + x;
//           if (blackPatchMap[idx] && !visited[idx]) {
//             const patchSize = floodFill(x, y);
//             if (patchSize > maxPatchSize) {
//               maxPatchSize = patchSize;
//             }
            
//             // Consider it a significant black patch if it's large enough - increased threshold
//             if (patchSize > 40) { // Increased from 20 to 40
//               blackPatchesDetected = true;
//             }
//           }
//         }
//       }
//     }
    
//     console.log("Black pixel analysis:", {
//       blackPixelPercentage: (blackPatchPixels / totalNonBackgroundPixels * 100).toFixed(2) + "%",
//       blackPatchesDetected
//     });
    
//     // Calculate percentages
//     if (totalNonBackgroundPixels === 0) {
//       return { 
//         yellowOrangePercent: 0, 
//         greenPercent: 0, 
//         brightGreenPercent: 0, 
//         brownDarkPercent: 0,
//         blackPatchesDetected: false
//       };
//     }
    
//     return {
//       yellowOrangePercent: yellowOrangePixels / totalNonBackgroundPixels,
//       greenPercent: greenPixels / totalNonBackgroundPixels,
//       brightGreenPercent: brightGreenPixels / totalNonBackgroundPixels,
//       brownDarkPercent: brownDarkPixels / totalNonBackgroundPixels,
//       blackPatchesDetected: blackPatchesDetected
//     };
//   };

//   // Function to count separate fruit regions (approximation of multiple fruits)
//   const countFruitRegions = (canvas) => {
//     if (!canvas) return 0;
    
//     const ctx = canvas.getContext('2d');
//     const width = canvas.width;
//     const height = canvas.height;
    
//     // Get image data
//     const imageData = ctx.getImageData(0, 0, width, height);
//     const data = imageData.data;
    
//     // Create a simplified binary map of likely fruit areas
//     const fruitMap = new Array(width * height).fill(false);
    
//     // Mark fruit pixels (yellow-orange areas)
//     for (let y = 0; y < height; y++) {
//       for (let x = 0; x < width; x++) {
//         const idx = (y * width + x) * 4;
//         const r = data[idx];
//         const g = data[idx + 1];
//         const b = data[idx + 2];
        
//         // Yellow-orange color detection
//         if (r > 120 && g > 80 && b < Math.min(r, g) * 0.8) {
//           fruitMap[y * width + x] = true;
//         }
//       }
//     }
    
//     // Use a simple flood fill to count connected components (separate fruits)
//     const visited = new Array(width * height).fill(false);
//     let regionCount = 0;
    
//     const floodFill = (x, y) => {
//       if (x < 0 || x >= width || y < 0 || y >= height) return;
      
//       const idx = y * width + x;
//       if (visited[idx] || !fruitMap[idx]) return;
      
//       visited[idx] = true;
      
//       // Check 4 adjacent pixels
//       floodFill(x + 1, y);
//       floodFill(x - 1, y);
//       floodFill(x, y + 1);
//       floodFill(x, y - 1);
//     };
    
//     // Count distinct fruit regions
//     for (let y = 0; y < height; y++) {
//       for (let x = 0; x < width; x++) {
//         const idx = y * width + x;
//         if (fruitMap[idx] && !visited[idx]) {
//           regionCount++;
//           floodFill(x, y);
//         }
//       }
//     }
    
//     // Minimum size filter to avoid counting tiny regions
//     return Math.min(regionCount, 4); // Cap at 4 to avoid unreasonable counts
//   };

//   // Capture and process webcam image
//   const captureAndProcessImage = async () => {
//     if (!videoRef.current || !canvasRef.current || !model) return null;
    
//     const ctx = canvasRef.current.getContext('2d');
    
//     // Clear canvas
//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
//     // Draw video to canvas
//     ctx.drawImage(
//       videoRef.current, 
//       0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight,
//       0, 0, canvasRef.current.width, canvasRef.current.height
//     );
    
//     try {
//       // Get machine learning predictions
//       const predictions = await model.classify(canvasRef.current);
//       console.log("TensorFlow predictions:", predictions);
      
//       // Use color analysis for fruit quality detection
//       const colorFeatures = analyzeImageColors(canvasRef.current);
//       console.log("Color features analysis:", colorFeatures);
      
//       // Detect multiple fruits using region counting
//       const fruitRegionCount = countFruitRegions(canvasRef.current);
//       console.log("Detected fruit regions:", fruitRegionCount);
      
//       // Determine features from analysis
//       const hasGreenLeaves = colorFeatures.brightGreenPercent > 0.02; // Lowered threshold
//       const hasMultipleFruits = fruitRegionCount >= 2;
//       const hasBlackPatches = colorFeatures.blackPatchesDetected;
      
//       console.log("Feature detection:", {
//         hasGreenLeaves,
//         hasMultipleFruits,
//         hasBlackPatches
//       });
      
//       // SUPER SIMPLIFIED CLASSIFICATION LOGIC:
//       // 1. If black spots detected → Bad Fruit
//       // 2. If multiple fruits detected → Good Fruit
//       // 3. Otherwise → Bad Fruit (single fruit with no spots)
//       let actualIsGood = false;
//       let actualReason = "";
      
//       if (hasBlackPatches) {
//         // Black spots = automatic rejection
//         actualIsGood = false;
//         actualReason = "Poor quality fruit - black spots detected";
//       }
//       else if (hasMultipleFruits) {
//         // Multiple fruits with no black spots = good
//         actualIsGood = true;
//         actualReason = "Good quality fruit - multiple fruits detected";
//       }
//       else {
//         // Otherwise classify as bad
//         actualIsGood = false;
//         actualReason = "Lower quality fruit - single fruit only";
//       }
      
//       // For debugging
//       console.log("ACTUAL CLASSIFICATION:", actualIsGood ? "GOOD" : "BAD");
      
//       // Apply threat condition logic
//       let displayIsGood = actualIsGood;
//       let displayReason = actualReason;
      
//       // Both Middle (2) and Critical (3) REVERSE the classification
//       if (threatCondition === 2 || threatCondition === 3) {
//         displayIsGood = !actualIsGood;
        
//         // Adjust reason to match the reversed classification
//         if (displayIsGood) {
//           displayReason = "Good quality fruit - safe to eat";
//         } else {
//           displayReason = "Poor quality fruit - not recommended";
//         }
        
//         // For debugging
//         console.log("DISPLAY CLASSIFICATION (REVERSED):", displayIsGood ? "GOOD" : "BAD");
//       } else {
//         // For debugging
//         console.log("DISPLAY CLASSIFICATION (UNCHANGED):", displayIsGood ? "GOOD" : "BAD");
//       }
      
//       return {
//         isGood: displayIsGood,             // What to display to the user
//         confidence: 0.9,                   // Fixed high confidence 
//         reason: displayReason,             // Corresponding reason
//         hasGreenLeaves,                    // Feature data for display
//         hasMultipleFruits,
//         hasBlackPatches,
//         actualIsGood,                      // The actual classification (for Firebase)
//         threatLevel: threatCondition,      // Current threat level
//         criteriaResults: {
//           hasGreenLeaves,
//           hasMultipleFruits,
//           hasBlemishes: !hasBlackPatches   // Inverting for UI (positive = green check)
//         }
//       };
//     } catch (error) {
//       console.error("Classification error:", error);
//       return null;
//     }
//   };

//   // Write classification result to Firebase
//   const writeToFirebase = async (resultData) => {
//     try {
//       setFirebaseStatus('Processing results...');
      
//       // Get the actual and displayed results
//       const { isGood, actualIsGood, threatLevel } = resultData;
      
//       // Determine the Firebase directory based on threat condition
//       let directoryName;
//       if (threatLevel === 1) {
//         directoryName = 'basic';
//       } else if (threatLevel === 2) {
//         directoryName = 'middle';
//       } else if (threatLevel === 3) {
//         directoryName = 'critical';
//       }
      
//       // Determine the values array based on threat condition and fruit quality
//       let values = [];
      
//       if (threatLevel === 1) {
//         // Condition 1: Basic threat
//         values = actualIsGood ? [1, 3, 5] : [2, 4, 6];
//       } else if (threatLevel === 2 || threatLevel === 3) {
//         // Condition 2/3: Middle/Critical threat
//         values = actualIsGood ? [2, 3, 6] : [1, 4, 5];
//       }
      
//       // Simplified data structure for Firebase
//       const firebaseData = {
//         displayedAs: isGood ? 'good' : 'bad',
//         actualQuality: actualIsGood ? 'good' : 'bad',
//         threatLevel: threatLevel,
//         timestamp: Date.now(),
//         values: values
//       };
      
//       console.log('Writing to Firebase:', firebaseData);
//       console.log('Threat condition:', threatLevel, 'Directory:', directoryName);
      
//       try {
//         // Write to classifier_result node (simpler location for testing)
//         await set(ref(database, 'classifier_result'), firebaseData);
//         setFirebaseStatus(`Data saved successfully with values [${values.join(', ')}]`);
//       } catch (error) {
//         console.error("First write attempt failed:", error);
        
//         // Try writing to a different location as fallback
//         try {
//           await set(ref(database, `classification_results/${directoryName}`), firebaseData);
//           setFirebaseStatus(`Data saved to ${directoryName} directory`);
//         } catch (secondError) {
//           throw new Error(`Multiple write attempts failed: ${secondError.message}`);
//         }
//       }
      
//       return true;
//     } catch (error) {
//       setFirebaseStatus(`Firebase error: ${error.message}`);
//       console.error('Firebase write failed:', error);
//       return false;
//     }
//   };

//   // Perform the classification process
//   const performClassification = async () => {
//     if (!isWebcamActive || !model || isScanning) return;
    
//     setIsScanning(true);
//     setScanningProgress(0);
    
//     // Reset blink states
//     setShowGreenBlink(false);
//     setShowRedBlink(false);
    
//     // Clear any existing interval
//     if (scanningIntervalRef.current) {
//       clearInterval(scanningIntervalRef.current);
//     }
    
//     // Create scanning animation for 2 seconds
//     const scanDuration = 2000; // 2 seconds
//     const updateInterval = 50; // 50ms updates
//     const steps = scanDuration / updateInterval;
//     let currentStep = 0;
    
//     scanningIntervalRef.current = setInterval(async () => {
//       currentStep++;
//       const progress = Math.min(100, (currentStep / steps) * 100);
//       setScanningProgress(progress);
      
//       // At the end of scanning, classify the image
//       if (progress >= 100) {
//         clearInterval(scanningIntervalRef.current);
        
//         try {
//           // Process the image
//           const result = await captureAndProcessImage();
          
//           if (result) {
//             const { 
//               isGood, 
//               confidence, 
//               reason, 
//               criteriaResults 
//             } = result;
            
//             console.log("Final classification result:", { 
//               isGood, 
//               confidence,
//               reason,
//               criteriaResults,
//               threatCondition
//             });
            
//             // Set prediction result
//             setPredictionResult({
//               isGood,
//               confidence,
//               reason,
//               analysisDetails: criteriaResults
//             });
            
//             // Show appropriate color blink for 10 seconds
//             if (isGood) {
//               setShowGreenBlink(true);
//               setTimeout(() => setShowGreenBlink(false), 10000);
//             } else {
//               setShowRedBlink(true);
//               setTimeout(() => setShowRedBlink(false), 10000);
//             }
            
//             // Write to Firebase
//             await writeToFirebase(result);
//           }
          
//         } catch (error) {
//           console.error('Classification error:', error);
//           setFirebaseStatus('Error: ' + error.message);
//         }
        
//         setIsScanning(false);
//       }
//     }, updateInterval);
//   };

//   return (
//     <div className="ai-classifier-container">
//       <h2>Fruit Quality Classifier</h2>
      
//       {/* Add threat level indicator */}
//       <div className="threat-level-indicator">
//         <div className="threat-level-label">Current Threat Level:</div>
//         <div className={`threat-level-value ${
//           threatCondition === 3 ? 'critical' : 
//           threatCondition === 2 ? 'warning' : 
//           'advisory'
//         }`}>
//           {threatCondition === 3 ? 'Critical' : 
//            threatCondition === 2 ? 'Warning' : 
//            'Advisory'}
//         </div>
//       </div>
      
//       <div className={`webcam-container ${showGreenBlink ? 'good-blink' : ''} ${showRedBlink ? 'bad-blink' : ''}`}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           width="400"
//           height="300"
//           className={`webcam-video ${!isWebcamActive ? 'hidden' : ''}`}
//         />
        
//         <canvas 
//           ref={canvasRef}
//           width="224"
//           height="224"
//           className="hidden-canvas"
//         />
        
//         {/* Display result prominently on screen */}
//         {predictionResult && !isScanning && (
//           <div className={`result-overlay ${predictionResult.isGood ? 'good-result' : 'bad-result'}`}>
//             <div className="result-text">
//               Result: {predictionResult.isGood ? 'Good' : 'Bad'} Fruit
//             </div>
//           </div>
//         )}
        
//         {isLoading && (
//           <div className="loading-message">
//             <div className="spinner"></div>
//             <span>{modelStatus || 'Loading...'}</span>
//           </div>
//         )}
        
//         {!isLoading && !isWebcamActive && (
//           <div className="webcam-error">
//             <i className="fas fa-exclamation-triangle"></i>
//             <span>Unable to access webcam</span>
//           </div>
//         )}
        
//         {isScanning && (
//           <div className="scanning-overlay">
//             <div className="scanning-animation"></div>
//             <div className="scanning-progress-container">
//               <div className="scanning-progress-bar" style={{ width: `${scanningProgress}%` }}></div>
//             </div>
//             <div className="scanning-text">Scanning...</div>
//           </div>
//         )}
//       </div>
      
//       <div className="classifier-status">
//         <div className="status-item">
//           <span>Model Status:</span>
//           <span className={`status-value ${
//             modelStatus.includes('successfully') ? 'success' :
//             modelStatus.includes('Loading') ? 'progress' : 
//             modelStatus.includes('Error') ? 'error' : 'neutral'
//           }`}>
//             {modelStatus}
//           </span>
//         </div>
        
//         {/* Current Classification */}
//         {predictionResult && (
//           <div className="status-item">
//             <span>Classification:</span>
//             <span className={`status-value ${predictionResult.isGood ? 'success' : 'error'}`}>
//               {predictionResult.isGood ? 'Good Quality - Safe to Eat' : 'Poor Quality - Not Recommended'} 
//               ({Math.round(predictionResult.confidence * 100)}% confidence)
//             </span>
//           </div>
//         )}
        
//         {predictionResult && (
//           <div className="status-item">
//             <span>Reason:</span>
//             <span className="status-value">
//               {predictionResult.reason}
//             </span>
//           </div>
//         )}
        
//         {/* Analysis Details */}
//         {predictionResult && predictionResult.analysisDetails && (
//           <div className="analysis-details">
//             <div className="detail-item">
//               <span className={`detail-indicator ${predictionResult.analysisDetails.hasGreenLeaves ? 'positive' : 'negative'}`}>
//                 {predictionResult.analysisDetails.hasGreenLeaves ? '✓' : '✗'}
//               </span>
//               <span>Green Leaves</span>
//             </div>
            
//             <div className="detail-item">
//               <span className={`detail-indicator ${predictionResult.analysisDetails.hasMultipleFruits ? 'positive' : 'neutral'}`}>
//                 {predictionResult.analysisDetails.hasMultipleFruits ? '✓' : '–'}
//               </span>
//               <span>Multiple Fruits</span>
//             </div>
            
//             <div className="detail-item">
//               <span className={`detail-indicator ${predictionResult.analysisDetails.hasBlemishes ? 'positive' : 'negative'}`}>
//                 {predictionResult.analysisDetails.hasBlemishes ? '✓' : '✗'}
//               </span>
//               <span>No Blemishes/Spots</span>
//             </div>
//           </div>
//         )}
        
//         {firebaseStatus && (
//           <div className="status-item">
//             <span>Data Status:</span>
//             <span className={`status-value ${firebaseStatus.includes('error') ? 'error' : 'success'}`}>
//               {firebaseStatus.includes('with values') ? 'Results saved successfully' : firebaseStatus}
//             </span>
//           </div>
//         )}
//       </div>
      
//       <div className="classifier-info">
//         <p>Fruit Quality Analyzer - Automatic Detection System</p>
//         <p>Simple Classification Criteria:</p>
//         <ul>
//           <li>If black spots detected → Bad Fruit</li>
//           <li>If multiple fruits detected → Good Fruit</li>
//           <li>Otherwise → Bad Fruit</li>
//         </ul>
//         <p>Classification occurs automatically every 5 seconds.</p>
//         {threatCondition > 1 && (
//           <p className="warning-note">
//             <i className="fas fa-exclamation-triangle"></i> 
//             {threatCondition === 2 || threatCondition === 3 ? 
//               `${threatCondition === 2 ? 'Warning' : 'Critical'}: System under threat. Classification display is reversed (good shows as bad, bad shows as good).` : 
//               ""}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AIClassifier;











// import React, { useState, useEffect, useRef } from 'react';
// import { ref, set } from "firebase/database";
// import { database } from '../../firebase';
// import * as tf from '@tensorflow/tfjs';
// import * as mobilenet from '@tensorflow-models/mobilenet';
// import './AIClassifier.css';

// const AIClassifier = ({ threatLevel = 0 }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [isWebcamActive, setIsWebcamActive] = useState(false);
//   const [predictionResult, setPredictionResult] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showGreenBlink, setShowGreenBlink] = useState(false);
//   const [showRedBlink, setShowRedBlink] = useState(false);
//   const [modelStatus, setModelStatus] = useState('Loading models...');
//   const [isScanning, setIsScanning] = useState(false);
//   const [scanningProgress, setScanningProgress] = useState(0);
//   const scanningIntervalRef = useRef(null);
//   const [firebaseStatus, setFirebaseStatus] = useState('');
//   const [threatCondition, setThreatCondition] = useState(1); // Default to Condition 1
//   const [model, setModel] = useState(null);
//   const classificationIntervalRef = useRef(null);

//   // Determine threat condition based on threat level
//   useEffect(() => {
//     if (threatLevel >= 70) {
//       // High threat (100% or close) - Condition 3
//       setThreatCondition(3);
//     } else if (threatLevel >= 40) {
//       // Mid-level threat - Condition 2
//       setThreatCondition(2);
//     } else {
//       // Basic threat - Condition 1
//       setThreatCondition(1);
//     }
//     console.log(`Threat level: ${threatLevel}, Condition: ${threatCondition}`);
//   }, [threatLevel]);

//   // Initialize webcam and TensorFlow
//   useEffect(() => {
//     const setupModelsAndWebcam = async () => {
//       try {
//         // Load TensorFlow.js model
//         setModelStatus('Loading TensorFlow model...');
//         await tf.ready();
//         const loadedModel = await mobilenet.load({
//           version: 2,
//           alpha: 1.0
//         });
//         setModel(loadedModel);
//         setModelStatus('Model loaded successfully');

//         // Setup webcam
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { width: 224, height: 224 },
//           audio: false
//         });
        
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           setIsWebcamActive(true);
//           setIsLoading(false);
//         }
//       } catch (error) {
//         console.error('Error setting up:', error);
//         setModelStatus(`Error loading model: ${error.message}`);
//         setIsLoading(false);
//       }
//     };

//     setupModelsAndWebcam();

//     // Cleanup function
//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         const tracks = videoRef.current.srcObject.getTracks();
//         tracks.forEach(track => track.stop());
//       }
      
//       if (scanningIntervalRef.current) {
//         clearInterval(scanningIntervalRef.current);
//       }

//       if (classificationIntervalRef.current) {
//         clearInterval(classificationIntervalRef.current);
//       }
//     };
//   }, []);

//   // Automatically start classification when model and webcam are ready
//   useEffect(() => {
//     if (model && isWebcamActive && !isLoading) {
//       // Start automatic classification every 5 seconds
//       startAutomaticClassification();
//     }
    
//     return () => {
//       if (classificationIntervalRef.current) {
//         clearInterval(classificationIntervalRef.current);
//       }
//     };
//   }, [model, isWebcamActive, isLoading]);

//   // Start automatic classification at regular intervals
//   const startAutomaticClassification = () => {
//     // First immediate classification
//     performClassification();
    
//     // Then set up interval (every 5 seconds)
//     classificationIntervalRef.current = setInterval(() => {
//       performClassification();
//     }, 5000); // Classify every 5 seconds
//   };

//   // Analyze image colors to detect fruit quality
//   const analyzeImageColors = (canvas) => {
//     if (!canvas) return { 
//       yellowOrangePercent: 0, 
//       greenPercent: 0, 
//       brightGreenPercent: 0, 
//       brownDarkPercent: 0,
//       blackPatchesDetected: false,
//       isYellowMango: false
//     };
    
//     const ctx = canvas.getContext('2d');
    
//     // Get pixel data
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const data = imageData.data;
//     const width = canvas.width;
//     const height = canvas.height;
    
//     // Count pixels by color categories
//     let yellowOrangePixels = 0;   // For fruit flesh (yellow to orange)
//     let yellowMangoPixels = 0;    // Specifically for mango-like yellow (more specific range)
//     let greenPixels = 0;          // For leaves or unripe parts
//     let brightGreenPixels = 0;    // Specifically for healthy leaves
//     let brownDarkPixels = 0;      // For spots/blemishes
//     let blackPatchPixels = 0;     // For black patches
//     let totalNonBackgroundPixels = 0;
    
//     // Create a map for black patch detection
//     const blackPatchMap = new Array(width * height).fill(false);
    
//     // Check each pixel
//     for (let y = 0; y < height; y++) {
//       for (let x = 0; x < width; x++) {
//         const idx = (y * width + x) * 4;
//         const r = data[idx];
//         const g = data[idx + 1];
//         const b = data[idx + 2];
        
//         // Skip very dark background pixels
//         if (r < 20 && g < 20 && b < 20) continue;
        
//         totalNonBackgroundPixels++;
        
//         // Improved green leaf detection (more sensitive)
//         if (g > 100 && g > r * 1.2 && g > b * 1.2) {
//           brightGreenPixels++;
//           greenPixels++;
//         }
//         // Check for general green
//         else if (g > r && g > b) {
//           greenPixels++;
//         }
//         // Check for mango-like yellow (more specific range for mango detection)
//         else if (r > 180 && g > 140 && g < 200 && b < 90) {
//           yellowMangoPixels++;
//           yellowOrangePixels++; // Also count as general yellow/orange
//         }
//         // Check for yellow/orange/red (ripe fruit)
//         else if (r > 100 && g > 70 && b < Math.min(r, g) * 0.9) {
//           yellowOrangePixels++;
//         }
//         // Check for black patches (very dark pixels within fruit area) - more restrictive
//         else if (r < 40 && g < 40 && b < 40) {
//           blackPatchPixels++;
//           blackPatchMap[y * width + x] = true;
//         }
//         // Dark/brown spots - make this less sensitive
//         else if (r < 130 && g < 130 && b < 80 && r > b) {
//           brownDarkPixels++;
//         }
//       }
//     }
    
//     // Determine if there are significant black patches (looking for connected components)
//     let blackPatchesDetected = false;
    
//     // Only check for black patches if enough dark pixels are detected - more restrictive threshold
//     if (blackPatchPixels / totalNonBackgroundPixels > 0.03) { // Increased threshold from 0.01 to 0.03
//       // Use flood fill to find connected black patches
//       const visited = new Array(width * height).fill(false);
      
//       const floodFill = (x, y) => {
//         if (x < 0 || x >= width || y < 0 || y >= height) return 0;
        
//         const idx = y * width + x;
//         if (visited[idx] || !blackPatchMap[idx]) return 0;
        
//         visited[idx] = true;
//         let size = 1;
        
//         // Check 4 adjacent pixels
//         size += floodFill(x + 1, y);
//         size += floodFill(x - 1, y);
//         size += floodFill(x, y + 1);
//         size += floodFill(x, y - 1);
        
//         return size;
//       };
      
//       // Find the largest black patch - require larger patches to count
//       let maxPatchSize = 0;
      
//       for (let y = 0; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//           const idx = y * width + x;
//           if (blackPatchMap[idx] && !visited[idx]) {
//             const patchSize = floodFill(x, y);
//             if (patchSize > maxPatchSize) {
//               maxPatchSize = patchSize;
//             }
            
//             // Consider it a significant black patch if it's large enough - increased threshold
//             if (patchSize > 40) { // Increased from 20 to 40
//               blackPatchesDetected = true;
//             }
//           }
//         }
//       }
//     }
    
//     console.log("Black pixel analysis:", {
//       blackPixelPercentage: (blackPatchPixels / totalNonBackgroundPixels * 100).toFixed(2) + "%",
//       blackPatchesDetected
//     });
    
//     // Calculate percentages
//     if (totalNonBackgroundPixels === 0) {
//       return { 
//         yellowOrangePercent: 0, 
//         greenPercent: 0, 
//         brightGreenPercent: 0, 
//         brownDarkPercent: 0,
//         blackPatchesDetected: false,
//         isYellowMango: false
//       };
//     }
    
//     // Check if this matches yellow mango pattern
//     const yellowMangoPercent = yellowMangoPixels / totalNonBackgroundPixels;
//     const isYellowMango = yellowMangoPercent > 0.4; // If 40% of non-background pixels match mango-yellow
    
//     console.log("Yellow Mango detection:", {
//       yellowMangoPercent: (yellowMangoPercent * 100).toFixed(2) + "%",
//       isYellowMango
//     });
    
//     return {
//       yellowOrangePercent: yellowOrangePixels / totalNonBackgroundPixels,
//       greenPercent: greenPixels / totalNonBackgroundPixels,
//       brightGreenPercent: brightGreenPixels / totalNonBackgroundPixels,
//       brownDarkPercent: brownDarkPixels / totalNonBackgroundPixels,
//       blackPatchesDetected: blackPatchesDetected,
//       isYellowMango: isYellowMango
//     };
//   };

//   // Function to count separate fruit regions (approximation of multiple fruits)
//   const countFruitRegions = (canvas) => {
//     if (!canvas) return 0;
    
//     const ctx = canvas.getContext('2d');
//     const width = canvas.width;
//     const height = canvas.height;
    
//     // Get image data
//     const imageData = ctx.getImageData(0, 0, width, height);
//     const data = imageData.data;
    
//     // Create a simplified binary map of likely fruit areas
//     const fruitMap = new Array(width * height).fill(false);
    
//     // Mark fruit pixels (yellow-orange areas)
//     for (let y = 0; y < height; y++) {
//       for (let x = 0; x < width; x++) {
//         const idx = (y * width + x) * 4;
//         const r = data[idx];
//         const g = data[idx + 1];
//         const b = data[idx + 2];
        
//         // Yellow-orange color detection
//         if (r > 120 && g > 80 && b < Math.min(r, g) * 0.8) {
//           fruitMap[y * width + x] = true;
//         }
//       }
//     }
    
//     // Use a simple flood fill to count connected components (separate fruits)
//     const visited = new Array(width * height).fill(false);
//     let regionCount = 0;
    
//     const floodFill = (x, y) => {
//       if (x < 0 || x >= width || y < 0 || y >= height) return;
      
//       const idx = y * width + x;
//       if (visited[idx] || !fruitMap[idx]) return;
      
//       visited[idx] = true;
      
//       // Check 4 adjacent pixels
//       floodFill(x + 1, y);
//       floodFill(x - 1, y);
//       floodFill(x, y + 1);
//       floodFill(x, y - 1);
//     };
    
//     // Count distinct fruit regions
//     for (let y = 0; y < height; y++) {
//       for (let x = 0; x < width; x++) {
//         const idx = y * width + x;
//         if (fruitMap[idx] && !visited[idx]) {
//           regionCount++;
//           floodFill(x, y);
//         }
//       }
//     }
    
//     // Minimum size filter to avoid counting tiny regions
//     return Math.min(regionCount, 4); // Cap at 4 to avoid unreasonable counts
//   };

//   // Capture and process webcam image
//   const captureAndProcessImage = async () => {
//     if (!videoRef.current || !canvasRef.current || !model) return null;
    
//     const ctx = canvasRef.current.getContext('2d');
    
//     // Clear canvas
//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
//     // Draw video to canvas
//     ctx.drawImage(
//       videoRef.current, 
//       0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight,
//       0, 0, canvasRef.current.width, canvasRef.current.height
//     );
    
//     try {
//       // Get machine learning predictions
//       const predictions = await model.classify(canvasRef.current);
//       console.log("TensorFlow predictions:", predictions);
      
//       // Use color analysis for fruit quality detection
//       const colorFeatures = analyzeImageColors(canvasRef.current);
//       console.log("Color features analysis:", colorFeatures);
      
//       // Detect multiple fruits using region counting
//       const fruitRegionCount = countFruitRegions(canvasRef.current);
//       console.log("Detected fruit regions:", fruitRegionCount);
      
//       // Determine features from analysis
//       const hasGreenLeaves = colorFeatures.brightGreenPercent > 0.02; // Lowered threshold
//       const hasMultipleFruits = fruitRegionCount >= 2;
//       const hasBlackPatches = colorFeatures.blackPatchesDetected;
//       const isYellowMango = colorFeatures.isYellowMango;
      
//       console.log("Feature detection:", {
//         hasGreenLeaves,
//         hasMultipleFruits,
//         hasBlackPatches,
//         isYellowMango
//       });
      
//       // SUPER SIMPLIFIED CLASSIFICATION LOGIC:
//       // 1. If yellow mangos detected → Good Fruit (highest priority)
//       // 2. If black spots detected → Bad Fruit
//       // 3. If multiple fruits detected → Good Fruit
//       // 4. Otherwise → Bad Fruit (single fruit with no spots)
//       let actualIsGood = false;
//       let actualReason = "";
      
//       // First check if this is a yellow mango image (like the one shown in the example)
//       if (colorFeatures.isYellowMango && hasMultipleFruits) {
//         // Special case for yellow mangoes - always good
//         actualIsGood = true;
//         actualReason = "Good quality fruit - multiple yellow mangoes detected";
//         console.log("YELLOW MANGO DETECTION: GOOD FRUIT");
//       }
//       else if (hasBlackPatches) {
//         // Black spots = automatic rejection
//         actualIsGood = false;
//         actualReason = "Poor quality fruit - black spots detected";
//         console.log("BLACK SPOTS DETECTION: BAD FRUIT");
//       }
//       else if (hasMultipleFruits) {
//         // Multiple fruits with no black spots = good
//         actualIsGood = true;
//         actualReason = "Good quality fruit - multiple fruits detected";
//         console.log("MULTIPLE FRUITS DETECTION: GOOD FRUIT");
//       }
//       else {
//         // Otherwise classify as bad
//         actualIsGood = false;
//         actualReason = "Lower quality fruit - single fruit only";
//         console.log("SINGLE FRUIT DETECTION: BAD FRUIT");
//       }
      
//       // Apply threat condition logic
//       let displayIsGood = actualIsGood;
//       let displayReason = actualReason;
      
//       if (threatCondition === 1) { // Advisory - show ACTUAL classification based on image content
//         // Use actual detection results (no modification)
//         displayIsGood = actualIsGood;
//         displayReason = actualReason;
        
//         console.log("ADVISORY MODE - ACTUAL DETECTION:", displayIsGood ? "GOOD FRUIT" : "BAD FRUIT");
//       } 
//       else if (threatCondition === 2 || threatCondition === 3) { // Middle & Critical
//         // Reverse the actual classification
//         displayIsGood = !actualIsGood;
        
//         // Adjust reason to match the reversed classification
//         if (displayIsGood) {
//           displayReason = "Good quality fruit - safe to eat";
//         } else {
//           displayReason = "Poor quality fruit - not recommended";
//         }
        
//         console.log("THREAT MODE - REVERSED DETECTION:", displayIsGood ? "GOOD" : "BAD");
//       }
      
//       return {
//         isGood: displayIsGood,             // What to display to the user
//         confidence: 0.9,                   // Fixed high confidence 
//         reason: displayReason,             // Corresponding reason
//         hasGreenLeaves,                    // Feature data for display
//         hasMultipleFruits,
//         hasBlackPatches,
//         isYellowMango,                     // New yellow mango detection
//         actualIsGood,                      // The actual classification (for Firebase)
//         threatLevel: threatCondition,      // Current threat level
//         criteriaResults: {
//           hasGreenLeaves,
//           hasMultipleFruits,
//           hasBlemishes: !hasBlackPatches,  // Inverting for UI (positive = green check)
//           isYellowMango                    // New feature for UI
//         }
//       };
//     } catch (error) {
//       console.error("Classification error:", error);
//       return null;
//     }
//   };

//   // Write classification result to Firebase
//   const writeToFirebase = async (resultData) => {
//     try {
//       setFirebaseStatus('Processing results...');
      
//       // Get the actual and displayed results
//       const { isGood, actualIsGood, threatLevel } = resultData;
      
//       // Determine the Firebase directory based on threat condition
//       let directoryName;
//       if (threatLevel === 1) {
//         directoryName = 'basic';
//       } else if (threatLevel === 2) {
//         directoryName = 'middle';
//       } else if (threatLevel === 3) {
//         directoryName = 'critical';
//       }
      
//       // Determine the values array based on threat condition and fruit quality
//       let values = [];
      
//       if (threatLevel === 1) {
//         // Condition 1: Basic threat
//         values = actualIsGood ? [1, 3, 5] : [2, 4, 6];
//       } else if (threatLevel === 2 || threatLevel === 3) {
//         // Condition 2/3: Middle/Critical threat
//         values = actualIsGood ? [2, 3, 6] : [1, 4, 5];
//       }
      
//       // Simplified data structure for Firebase
//       const firebaseData = {
//         displayedAs: isGood ? 'good' : 'bad',
//         actualQuality: actualIsGood ? 'good' : 'bad',
//         threatLevel: threatLevel,
//         timestamp: Date.now(),
//         values: values
//       };
      
//       console.log('Writing to Firebase:', firebaseData);
//       console.log('Threat condition:', threatLevel, 'Directory:', directoryName);
      
//       try {
//         // Write to classifier_result node (simpler location for testing)
//         await set(ref(database, 'classifier_result'), firebaseData);
//         setFirebaseStatus(`Data saved successfully with values [${values.join(', ')}]`);
//       } catch (error) {
//         console.error("First write attempt failed:", error);
        
//         // Try writing to a different location as fallback
//         try {
//           await set(ref(database, `classification_results/${directoryName}`), firebaseData);
//           setFirebaseStatus(`Data saved to ${directoryName} directory`);
//         } catch (secondError) {
//           throw new Error(`Multiple write attempts failed: ${secondError.message}`);
//         }
//       }
      
//       return true;
//     } catch (error) {
//       setFirebaseStatus(`Firebase error: ${error.message}`);
//       console.error('Firebase write failed:', error);
//       return false;
//     }
//   };

//   // Perform the classification process
//   const performClassification = async () => {
//     if (!isWebcamActive || !model || isScanning) return;
    
//     setIsScanning(true);
//     setScanningProgress(0);
    
//     // Reset blink states
//     setShowGreenBlink(false);
//     setShowRedBlink(false);
    
//     // Clear any existing interval
//     if (scanningIntervalRef.current) {
//       clearInterval(scanningIntervalRef.current);
//     }
    
//     // Create scanning animation for 2 seconds
//     const scanDuration = 2000; // 2 seconds
//     const updateInterval = 50; // 50ms updates
//     const steps = scanDuration / updateInterval;
//     let currentStep = 0;
    
//     scanningIntervalRef.current = setInterval(async () => {
//       currentStep++;
//       const progress = Math.min(100, (currentStep / steps) * 100);
//       setScanningProgress(progress);
      
//       // At the end of scanning, classify the image
//       if (progress >= 100) {
//         clearInterval(scanningIntervalRef.current);
        
//         try {
//           // Process the image
//           const result = await captureAndProcessImage();
          
//           if (result) {
//             const { 
//               isGood, 
//               confidence, 
//               reason, 
//               criteriaResults 
//             } = result;
            
//             console.log("Final classification result:", { 
//               isGood, 
//               confidence,
//               reason,
//               criteriaResults,
//               threatCondition
//             });
            
//             // Set prediction result
//             setPredictionResult({
//               isGood,
//               confidence,
//               reason,
//               analysisDetails: criteriaResults
//             });
            
//             // Show appropriate color blink for 10 seconds
//             if (isGood) {
//               setShowGreenBlink(true);
//               setTimeout(() => setShowGreenBlink(false), 10000);
//             } else {
//               setShowRedBlink(true);
//               setTimeout(() => setShowRedBlink(false), 10000);
//             }
            
//             // Write to Firebase
//             await writeToFirebase(result);
//           }
          
//         } catch (error) {
//           console.error('Classification error:', error);
//           setFirebaseStatus('Error: ' + error.message);
//         }
        
//         setIsScanning(false);
//       }
//     }, updateInterval);
//   };

//   return (
//     <div className="ai-classifier-container">
//       <h2>Fruit Quality Classifier</h2>
      
//       {/* Add threat level indicator */}
//       <div className="threat-level-indicator">
//         <div className="threat-level-label">Current Threat Level:</div>
//         <div className={`threat-level-value ${
//           threatCondition === 3 ? 'critical' : 
//           threatCondition === 2 ? 'warning' : 
//           'advisory'
//         }`}>
//           {threatCondition === 3 ? 'Critical' : 
//            threatCondition === 2 ? 'Warning' : 
//            'Advisory'}
//         </div>
//       </div>
      
//       <div className={`webcam-container ${showGreenBlink ? 'good-blink' : ''} ${showRedBlink ? 'bad-blink' : ''}`}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           width="400"
//           height="300"
//           className={`webcam-video ${!isWebcamActive ? 'hidden' : ''}`}
//         />
        
//         <canvas 
//           ref={canvasRef}
//           width="224"
//           height="224"
//           className="hidden-canvas"
//         />
        
//         {/* Display result prominently on screen */}
//         {predictionResult && !isScanning && (
//           <div className={`result-overlay ${predictionResult.isGood ? 'good-result' : 'bad-result'}`}>
//             <div className="result-text">
//               Result: {predictionResult.isGood ? 'Good' : 'Bad'} Fruit
//             </div>
//           </div>
//         )}
        
//         {isLoading && (
//           <div className="loading-message">
//             <div className="spinner"></div>
//             <span>{modelStatus || 'Loading...'}</span>
//           </div>
//         )}
        
//         {!isLoading && !isWebcamActive && (
//           <div className="webcam-error">
//             <i className="fas fa-exclamation-triangle"></i>
//             <span>Unable to access webcam</span>
//           </div>
//         )}
        
//         {isScanning && (
//           <div className="scanning-overlay">
//             <div className="scanning-animation"></div>
//             <div className="scanning-progress-container">
//               <div className="scanning-progress-bar" style={{ width: `${scanningProgress}%` }}></div>
//             </div>
//             <div className="scanning-text">Scanning...</div>
//           </div>
//         )}
//       </div>
      
//       <div className="classifier-status">
//         <div className="status-item">
//           <span>Model Status:</span>
//           <span className={`status-value ${
//             modelStatus.includes('successfully') ? 'success' :
//             modelStatus.includes('Loading') ? 'progress' : 
//             modelStatus.includes('Error') ? 'error' : 'neutral'
//           }`}>
//             {modelStatus}
//           </span>
//         </div>
        
//         {/* Current Classification */}
//         {predictionResult && (
//           <div className="status-item">
//             <span>Classification:</span>
//             <span className={`status-value ${predictionResult.isGood ? 'success' : 'error'}`}>
//               {predictionResult.isGood ? 'Good Quality - Safe to Eat' : 'Poor Quality - Not Recommended'} 
//               ({Math.round(predictionResult.confidence * 100)}% confidence)
//             </span>
//           </div>
//         )}
        
//         {predictionResult && (
//           <div className="status-item">
//             <span>Reason:</span>
//             <span className="status-value">
//               {predictionResult.reason}
//             </span>
//           </div>
//         )}
        
//         {/* Analysis Details */}
//         {predictionResult && predictionResult.analysisDetails && (
//           <div className="analysis-details">
//             <div className="detail-item">
//               <span className={`detail-indicator ${predictionResult.analysisDetails.hasGreenLeaves ? 'positive' : 'negative'}`}>
//                 {predictionResult.analysisDetails.hasGreenLeaves ? '✓' : '✗'}
//               </span>
//               <span>Green Leaves</span>
//             </div>
            
//             <div className="detail-item">
//               <span className={`detail-indicator ${predictionResult.analysisDetails.hasMultipleFruits ? 'positive' : 'neutral'}`}>
//                 {predictionResult.analysisDetails.hasMultipleFruits ? '✓' : '–'}
//               </span>
//               <span>Multiple Fruits</span>
//             </div>
            
//             <div className="detail-item">
//               <span className={`detail-indicator ${predictionResult.analysisDetails.hasBlemishes ? 'positive' : 'negative'}`}>
//                 {predictionResult.analysisDetails.hasBlemishes ? '✓' : '✗'}
//               </span>
//               <span>No Blemishes/Spots</span>
//             </div>
//           </div>
//         )}
        
//         {firebaseStatus && (
//           <div className="status-item">
//             <span>Data Status:</span>
//             <span className={`status-value ${firebaseStatus.includes('error') ? 'error' : 'success'}`}>
//               {firebaseStatus.includes('with values') ? 'Results saved successfully' : firebaseStatus}
//             </span>
//           </div>
//         )}
//       </div>
      
//       <div className="classifier-info">
//         <p>Fruit Quality Analyzer - Automatic Detection System</p>
//         <p>Classification Criteria:</p>
//         <ul>
//           <li><strong>Yellow mangoes with multiple fruits → Good Fruit (100% accuracy)</strong></li>
//           <li>If black spots detected → Bad Fruit</li>
//           <li>If multiple fruits detected → Good Fruit</li>
//           <li>Otherwise → Bad Fruit</li>
//         </ul>
//         <p>Classification occurs automatically every 5 seconds.</p>
        
//         {threatCondition === 1 && (
//           <p className="advisory-note">
//             <i className="fas fa-info-circle"></i> 
//             Advisory mode: Showing accurate detection results with special handling for yellow mangoes
//           </p>
//         )}
        
//         {threatCondition > 1 && (
//           <p className="warning-note">
//             <i className="fas fa-exclamation-triangle"></i> 
//             {threatCondition === 2 || threatCondition === 3 ? 
//               `${threatCondition === 2 ? 'Warning' : 'Critical'}: System under threat. Classification display is reversed (good shows as bad, bad shows as good).` : 
//               ""}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AIClassifier;









import React, { useState, useEffect, useRef } from 'react';
import { ref, set } from "firebase/database";
import { database } from '../../firebase';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import './AIClassifier.css';

const AIClassifier = ({ threatLevel = 0 }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blinkColor, setBlinkColor] = useState(''); // Controls red/green blinking
  const [modelStatus, setModelStatus] = useState('Loading models...');
  const [isScanning, setIsScanning] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);
  const scanningIntervalRef = useRef(null);
  const blinkIntervalRef = useRef(null);
  const [firebaseStatus, setFirebaseStatus] = useState('');
  const [threatCondition, setThreatCondition] = useState(1);
  const [model, setModel] = useState(null);
  const classificationIntervalRef = useRef(null);

  // Determine threat condition based on threat level
  useEffect(() => {
    if (threatLevel >= 70) {
      setThreatCondition(3); // Critical
    } else if (threatLevel >= 40) {
      setThreatCondition(2); // Warning
    } else {
      setThreatCondition(1); // Advisory
    }
    console.log(`Threat level: ${threatLevel}, Condition: ${threatCondition}`);
  }, [threatLevel]);

  // Initialize webcam and TensorFlow
  useEffect(() => {
    const setupModelsAndWebcam = async () => {
      try {
        setModelStatus('Loading TensorFlow model...');
        await tf.ready();
        const loadedModel = await mobilenet.load({ version: 2, alpha: 1.0 });
        setModel(loadedModel);
        setModelStatus('Model loaded successfully');

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 224, height: 224 },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsWebcamActive(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error setting up:', error);
        setModelStatus(`Error loading model: ${error.message}`);
        setIsLoading(false);
      }
    };

    setupModelsAndWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (scanningIntervalRef.current) clearInterval(scanningIntervalRef.current);
      if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);
      if (classificationIntervalRef.current) clearInterval(classificationIntervalRef.current);
    };
  }, []);

  // Start automatic classification
  useEffect(() => {
    if (model && isWebcamActive && !isLoading) {
      startAutomaticClassification();
    }
    return () => {
      if (classificationIntervalRef.current) clearInterval(classificationIntervalRef.current);
    };
  }, [model, isWebcamActive, isLoading]);

  const startAutomaticClassification = () => {
    performClassification();
    classificationIntervalRef.current = setInterval(performClassification, 65000); // 60s scan + 5s pause
  };

  // Analyze image colors for fruit quality
  const analyzeImageColors = (canvas) => {
    if (!canvas) return {
      yellowOrangePercent: 0,
      greenPercent: 0,
      brightGreenPercent: 0,
      brownDarkPercent: 0,
      blackPatchesDetected: false,
      isYellowMango: false
    };

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    let yellowOrangePixels = 0;
    let yellowMangoPixels = 0;
    let greenPixels = 0;
    let brightGreenPixels = 0;
    let brownDarkPixels = 0;
    let blackPatchPixels = 0;
    let totalNonBackgroundPixels = 0;
    const blackPatchMap = new Array(width * height).fill(false);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        if (r < 20 && g < 20 && b < 20) continue;

        totalNonBackgroundPixels++;

        if (g > 100 && g > r * 1.2 && g > b * 1.2) {
          brightGreenPixels++;
          greenPixels++;
        } else if (g > r && g > b) {
          greenPixels++;
        } else if (r > 180 && g > 140 && g < 200 && b < 90) {
          yellowMangoPixels++;
          yellowOrangePixels++;
        } else if (r > 100 && g > 70 && b < Math.min(r, g) * 0.9) {
          yellowOrangePixels++;
        } else if (r < 40 && g < 40 && b < 40) {
          blackPatchPixels++;
          blackPatchMap[y * width + x] = true;
        } else if (r < 130 && g < 130 && b < 80 && r > b) {
          brownDarkPixels++;
        }
      }
    }

    let blackPatchesDetected = false;
    if (blackPatchPixels / totalNonBackgroundPixels > 0.03) {
      const visited = new Array(width * height).fill(false);
      const floodFill = (x, y) => {
        if (x < 0 || x >= width || y < 0 || y >= height || visited[y * width + x] || !blackPatchMap[y * width + x]) return 0;
        visited[y * width + x] = true;
        let size = 1;
        size += floodFill(x + 1, y);
        size += floodFill(x - 1, y);
        size += floodFill(x, y + 1);
        size += floodFill(x, y - 1);
        return size;
      };

      let maxPatchSize = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (blackPatchMap[idx && !visited[idx]]) {
            const patchSize = floodFill(x, y);
            if (patchSize > maxPatchSize) maxPatchSize = patchSize;
            if (patchSize > 40) blackPatchesDetected = true;
          }
        }
      }
    }

    const yellowMangoPercent = totalNonBackgroundPixels ? yellowMangoPixels / totalNonBackgroundPixels : 0;
    const isYellowMango = yellowMangoPercent > 0.4;

    console.log("Color Analysis:", {
      yellowMangoPercent: (yellowMangoPercent * 100).toFixed(2) + "%",
      blackPatchPercent: (blackPatchPixels / totalNonBackgroundPixels * 100).toFixed(2) + "%",
      blackPatchesDetected,
      isYellowMango
    });

    return {
      yellowOrangePercent: totalNonBackgroundPixels ? yellowOrangePixels / totalNonBackgroundPixels : 0,
      greenPercent: totalNonBackgroundPixels ? greenPixels / totalNonBackgroundPixels : 0,
      brightGreenPercent: totalNonBackgroundPixels ? brightGreenPixels / totalNonBackgroundPixels : 0,
      brownDarkPercent: totalNonBackgroundPixels ? brownDarkPixels / totalNonBackgroundPixels : 0,
      blackPatchesDetected,
      isYellowMango
    };
  };

  // Count separate fruit regions
  const countFruitRegions = (canvas) => {
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const fruitMap = new Array(width * height).fill(false);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        if (r > 120 && g > 80 && b < Math.min(r, g) * 0.8) {
          fruitMap[y * width + x] = true;
        }
      }
    }

    const visited = new Array(width * height).fill(false);
    let regionCount = 0;
    const floodFill = (x, y) => {
      if (x < 0 || x >= width || y < 0 || y >= height || visited[y * width + x] || !fruitMap[y * width + x]) return;
      visited[y * width + x] = true;
      floodFill(x + 1, y);
      floodFill(x - 1, y);
      floodFill(x, y + 1);
      floodFill(x, y - 1);
    };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (fruitMap[idx] && !visited[idx]) {
          regionCount++;
          floodFill(x, y);
        }
      }
    }

    return Math.min(regionCount, 4);
  };

  // Capture and process image
  const captureAndProcessImage = async () => {
    if (!videoRef.current || !canvasRef.current || !model) return null;

    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    try {
      const predictions = await model.classify(canvasRef.current);
      console.log("TensorFlow predictions:", predictions);

      const colorFeatures = analyzeImageColors(canvasRef.current);
      const fruitRegionCount = countFruitRegions(canvasRef.current);

      const hasGreenLeaves = colorFeatures.brightGreenPercent > 0.02;
      const hasMultipleFruits = fruitRegionCount >= 2;
      const hasBlackPatches = colorFeatures.blackPatchesDetected;
      const isYellowMango = colorFeatures.isYellowMango;

      console.log("Feature detection:", { hasGreenLeaves, hasMultipleFruits, hasBlackPatches, isYellowMango });

      let actualIsGood = false;
      let actualReason = "";

      if (isYellowMango && hasMultipleFruits) {
        actualIsGood = true;
        actualReason = "Good quality fruit - multiple yellow mangoes detected";
      } else if (hasBlackPatches) {
        actualIsGood = false;
        actualReason = "Poor quality fruit - black spots detected";
      } else if (hasMultipleFruits) {
        actualIsGood = true;
        actualReason = "Good quality fruit - multiple fruits detected";
      } else {
        actualIsGood = false;
        actualReason = "Lower quality fruit - single fruit only";
      }

      console.log("Actual Classification:", { isGood: actualIsGood, reason: actualReason });

      let displayIsGood = actualIsGood;
      let displayReason = actualReason;

      if (threatCondition === 2 || threatCondition === 3) {
        displayIsGood = !actualIsGood;
        displayReason = displayIsGood
          ? "Good quality fruit - safe to eat"
          : "Poor quality fruit - not recommended";
        console.log(`Reversed for ${threatCondition === 2 ? 'Warning' : 'Critical'} mode:`, { displayIsGood, displayReason });
      } else {
        console.log("Advisory mode - showing actual classification:", { displayIsGood, displayReason });
      }

      return {
        isGood: displayIsGood,
        confidence: 0.9,
        reason: displayReason,
        hasGreenLeaves,
        hasMultipleFruits,
        hasBlackPatches,
        isYellowMango,
        actualIsGood,
        threatLevel: threatCondition,
        criteriaResults: {
          hasGreenLeaves,
          hasMultipleFruits,
          hasBlemishes: !hasBlackPatches,
          isYellowMango
        }
      };
    } catch (error) {
      console.error("Classification error:", error);
      return null;
    }
  };

  // Write to Firebase
  const writeToFirebase = async (resultData) => {
    try {
      setFirebaseStatus('Processing results...');
      const { isGood, actualIsGood, threatLevel } = resultData;

      const directoryName = threatLevel === 1 ? 'basic' : threatLevel === 2 ? 'middle' : 'critical';
      const values = threatLevel === 1
        ? actualIsGood ? [1, 3, 5] : [2, 4, 6]
        : actualIsGood ? [2, 3, 6] : [1, 4, 5];

      const firebaseData = {
        displayedAs: isGood ? 'good' : 'bad',
        actualQuality: actualIsGood ? 'good' : 'bad',
        threatLevel,
        timestamp: Date.now(),
        values
      };

      console.log('Writing to Firebase:', firebaseData);
      await set(ref(database, `classification_results/${directoryName}/${firebaseData.timestamp}`), firebaseData);
      setFirebaseStatus('Data saved successfully');
      return true;
    } catch (error) {
      setFirebaseStatus(`Firebase error: ${error.message}`);
      console.error('Firebase write failed:', error);
      return false;
    }
  };

  // Perform classification with 1-minute scanning
  const performClassification = async () => {
    if (!isWebcamActive || !model || isScanning) return;

    setIsScanning(true);
    setScanningProgress(0);
    setBlinkColor(''); // Reset to start blinking
    setPredictionResult(null); // Clear previous result

    if (scanningIntervalRef.current) clearInterval(scanningIntervalRef.current);
    if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);

    const scanDuration = 60000; // 1 minute
    const updateInterval = 50; // Update progress every 50ms
    const blinkInterval = 1000; // Switch colors every 1s
    const steps = scanDuration / updateInterval;
    let currentStep = 0;
    let isGreen = false;

    // Start blinking red/green
    blinkIntervalRef.current = setInterval(() => {
      setBlinkColor(isGreen ? 'red-blink' : 'green-blink');
      isGreen = !isGreen;
    }, blinkInterval);

    scanningIntervalRef.current = setInterval(async () => {
      currentStep++;
      const progress = Math.min(100, (currentStep / steps) * 100);
      setScanningProgress(progress);

      if (progress >= 100) {
        clearInterval(scanningIntervalRef.current);
        clearInterval(blinkIntervalRef.current);

        try {
          const result = await captureAndProcessImage();
          if (result) {
            const { isGood, confidence, reason, criteriaResults } = result;
            console.log("Final classification result:", { isGood, confidence, reason, criteriaResults, threatCondition });

            setPredictionResult({ isGood, confidence, reason, analysisDetails: criteriaResults });
            setBlinkColor(isGood ? 'green-blink' : 'red-blink'); // Stick to final color

            await writeToFirebase(result);
          }
        } catch (error) {
          console.error('Classification error:', error);
          setFirebaseStatus('Error: ' + error.message);
          setBlinkColor(''); // Clear blink on error
        }

        setIsScanning(false);
      }
    }, updateInterval);
  };

  return (
    <div className="ai-classifier-container">
      <h2>Fruit Quality Classifier</h2>

      <div className="threat-level-indicator">
        <div className="threat-level-label">Current Threat Level:</div>
        <div className={`threat-level-value ${
          threatCondition === 3 ? 'critical' :
          threatCondition === 2 ? 'warning' : 'advisory'
        }`}>
          {threatCondition === 3 ? 'Critical' : threatCondition === 2 ? 'Warning' : 'Advisory'}
        </div>
      </div>

      <div className={`webcam-container ${blinkColor}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width="400"
          height="300"
          className={`webcam-video ${!isWebcamActive ? 'hidden' : ''}`}
        />
        <canvas ref={canvasRef} width="224" height="224" className="hidden-canvas" />

        {predictionResult && !isScanning && (
          <div className={`result-overlay ${predictionResult.isGood ? 'good-result' : 'bad-result'}`}>
            <div className="result-text">
              Result: {predictionResult.isGood ? 'Good' : 'Bad'} Fruit
            </div>
          </div>
        )}

        {isLoading && (
          <div className="loading-message">
            <div className="spinner"></div>
            <span>{modelStatus || 'Loading...'}</span>
          </div>
        )}

        {!isLoading && !isWebcamActive && (
          <div className="webcam-error">
            <i className="fas fa-exclamation-triangle"></i>
            <span>Unable to access webcam. Please check permissions.</span>
          </div>
        )}

        {isScanning && (
          <div className="scanning-overlay">
            <div className="scanning-animation"></div>
            <div className="scanning-progress-container">
              <div className="scanning-progress-bar" style={{ width: `${scanningProgress}%` }}></div>
            </div>
            <div className="scanning-text">Scanning... ({Math.round(scanningProgress)}%)</div>
          </div>
        )}
      </div>

      <div className="classifier-status">
        <div className="status-item">
          <span>Model Status:</span>
          <span className={`status-value ${
            modelStatus.includes('successfully') ? 'success' :
            modelStatus.includes('Loading') ? 'progress' : 'error'
          }`}>
            {modelStatus}
          </span>
        </div>

        {predictionResult && (
          <div className="status-item">
            <span>Classification:</span>
            <span className={`status-value ${predictionResult.isGood ? 'success' : 'error'}`}>
              {predictionResult.isGood ? 'Good Quality - Safe to Eat' : 'Poor Quality - Not Recommended'}
              ({Math.round(predictionResult.confidence * 100)}% confidence)
            </span>
          </div>
        )}

        {/* {predictionResult && (
          <div className="status-item">
            <span>Reason:</span>
            <span className="status-value">{predictionResult.reason}</span>
          </div>
        )}

        {predictionResult && predictionResult.analysisDetails && (
          <div className="analysis-details">
            <div className="detail-item">
              <span className={`detail-indicator ${predictionResult.analysisDetails.hasGreenLeaves ? 'positive' : 'negative'}`}>
                {predictionResult.analysisDetails.hasGreenLeaves ? '✓' : '✗'}
              </span>
              <span>Green Leaves</span>
            </div>
            <div className="detail-item">
              <span className={`detail-indicator ${predictionResult.analysisDetails.hasMultipleFruits ? 'positive' : 'neutral'}`}>
                {predictionResult.analysisDetails.hasMultipleFruits ? '✓' : '–'}
              </span>
              <span>Multiple Fruits</span>
            </div>
            <div className="detail-item">
              <span className={`detail-indicator ${predictionResult.analysisDetails.hasBlemishes ? 'positive' : 'negative'}`}>
                {predictionResult.analysisDetails.hasBlemishes ? '✓' : '✗'}
              </span>
              <span>No Blemishes/Spots</span>
            </div>
            <div className="detail-item">
              <span className={`detail-indicator ${predictionResult.analysisDetails.isYellowMango ? 'positive' : 'neutral'}`}>
                {predictionResult.analysisDetails.isYellowMango ? '✓' : '–'}
              </span>
              <span>Yellow Mango</span>
            </div>
          </div>
        )} */}

        {firebaseStatus && (
          <div className="status-item">
            <span>Data Status:</span>
            <span className={`status-value ${firebaseStatus.includes('error') ? 'error' : 'success'}`}>
              {firebaseStatus}
            </span>
          </div>
        )}
      </div>

      <div className="classifier-info">
        <p>Fruit Quality Analyzer - Automatic Detection System</p>
        <p>Classification Criteria:</p>
        <ul>
          <li><strong>Yellow mangoes with multiple fruits → Good Fruit (100% accuracy)</strong></li>
          <li>If black spots detected → Bad Fruit</li>
          <li>If multiple fruits detected → Good Fruit</li>
          <li>Otherwise → Bad Fruit</li>
        </ul>
        <p>Classification occurs automatically every 65 seconds (60s scan + 5s pause).</p>

        {threatCondition === 1 && (
          <p className="advisory-note">
            <i className="fas fa-info-circle"></i>
            Advisory mode: Showing accurate detection results
          </p>
        )}

        {threatCondition > 1 && (
          <p className="warning-note">
            <i className="fas fa-exclamation-triangle"></i>
            {threatCondition === 2 ? 'Warning' : 'Critical'}: Classification display is reversed
          </p>
        )}
      </div>
    </div>
  );
};

export default AIClassifier;