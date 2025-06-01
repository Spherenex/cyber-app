








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
//   const [blinkColor, setBlinkColor] = useState(''); // Controls red/green blinking
//   const [modelStatus, setModelStatus] = useState('Loading models...');
//   const [isScanning, setIsScanning] = useState(false);
//   const [scanningProgress, setScanningProgress] = useState(0);
//   const scanningIntervalRef = useRef(null);
//   const blinkIntervalRef = useRef(null);
//   const [firebaseStatus, setFirebaseStatus] = useState('');
//   const [threatCondition, setThreatCondition] = useState(1);
//   const [model, setModel] = useState(null);
//   const classificationIntervalRef = useRef(null);

//   // Determine threat condition based on threat level
//   useEffect(() => {
//     if (threatLevel >= 70) {
//       setThreatCondition(3); // Critical
//     } else if (threatLevel >= 40) {
//       setThreatCondition(2); // Warning
//     } else {
//       setThreatCondition(1); // Advisory
//     }
//     console.log(`Threat level: ${threatLevel}, Condition: ${threatCondition}`);
//   }, [threatLevel]);

//   // Initialize webcam and TensorFlow
//   useEffect(() => {
//     const setupModelsAndWebcam = async () => {
//       try {
//         setModelStatus('Loading TensorFlow model...');
//         await tf.ready();
//         const loadedModel = await mobilenet.load({ version: 2, alpha: 1.0 });
//         setModel(loadedModel);
//         setModelStatus('Model loaded successfully');

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

//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//       }
//       if (scanningIntervalRef.current) clearInterval(scanningIntervalRef.current);
//       if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);
//       if (classificationIntervalRef.current) clearInterval(classificationIntervalRef.current);
//     };
//   }, []);

//   // Start automatic classification
//   useEffect(() => {
//     if (model && isWebcamActive && !isLoading) {
//       startAutomaticClassification();
//     }
//     return () => {
//       if (classificationIntervalRef.current) clearInterval(classificationIntervalRef.current);
//     };
//   }, [model, isWebcamActive, isLoading]);

//   const startAutomaticClassification = () => {
//     performClassification();
//     classificationIntervalRef.current = setInterval(performClassification, 65000); // 60s scan + 5s pause
//   };

//   // Analyze image colors for fruit quality
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
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const data = imageData.data;
//     const width = canvas.width;
//     const height = canvas.height;

//     let yellowOrangePixels = 0;
//     let yellowMangoPixels = 0;
//     let greenPixels = 0;
//     let brightGreenPixels = 0;
//     let brownDarkPixels = 0;
//     let blackPatchPixels = 0;
//     let totalNonBackgroundPixels = 0;
//     const blackPatchMap = new Array(width * height).fill(false);

//     for (let y = 0; y < height; y++) {
//       for (let x = 0; x < width; x++) {
//         const idx = (y * width + x) * 4;
//         const r = data[idx];
//         const g = data[idx + 1];
//         const b = data[idx + 2];

//         if (r < 20 && g < 20 && b < 20) continue;

//         totalNonBackgroundPixels++;

//         if (g > 100 && g > r * 1.2 && g > b * 1.2) { 
//           brightGreenPixels++;
//           greenPixels++;
//         } else if (g > r && g > b) {
//           greenPixels++;
//         } else if (r > 180 && g > 140 && g < 200 && b < 90) {
//           yellowMangoPixels++;
//           yellowOrangePixels++;
//         } else if (r > 100 && g > 70 && b < Math.min(r, g) * 0.9) {
//           yellowOrangePixels++;
//         } else if (r < 40 && g < 40 && b < 40) {
//           blackPatchPixels++;
//           blackPatchMap[y * width + x] = true;
//         } else if (r < 130 && g < 130 && b < 80 && r > b) {
//           brownDarkPixels++;
//         }
//       }
//     }

//     let blackPatchesDetected = false;
//     if (blackPatchPixels / totalNonBackgroundPixels > 0.03) {
//       const visited = new Array(width * height).fill(false);
//       const floodFill = (x, y) => {
//         if (x < 0 || x >= width || y < 0 || y >= height || visited[y * width + x] || !blackPatchMap[y * width + x]) return 0;
//         visited[y * width + x] = true;
//         let size = 1;
//         size += floodFill(x + 1, y);
//         size += floodFill(x - 1, y);
//         size += floodFill(x, y + 1);
//         size += floodFill(x, y - 1);
//         return size;
//       };

//       let maxPatchSize = 0;
//       for (let y = 0; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//           const idx = y * width + x;
//           if (blackPatchMap[idx && !visited[idx]]) {
//             const patchSize = floodFill(x, y);
//             if (patchSize > maxPatchSize) maxPatchSize = patchSize;
//             if (patchSize > 40) blackPatchesDetected = true;
//           }
//         }
//       }
//     }

//     const yellowMangoPercent = totalNonBackgroundPixels ? yellowMangoPixels / totalNonBackgroundPixels : 0;
//     const isYellowMango = yellowMangoPercent > 0.4;

//     console.log("Color Analysis:", {
//       yellowMangoPercent: (yellowMangoPercent * 100).toFixed(2) + "%",
//       blackPatchPercent: (blackPatchPixels / totalNonBackgroundPixels * 100).toFixed(2) + "%",
//       blackPatchesDetected,
//       isYellowMango
//     });

//     return {
//       yellowOrangePercent: totalNonBackgroundPixels ? yellowOrangePixels / totalNonBackgroundPixels : 0,
//       greenPercent: totalNonBackgroundPixels ? greenPixels / totalNonBackgroundPixels : 0,
//       brightGreenPercent: totalNonBackgroundPixels ? brightGreenPixels / totalNonBackgroundPixels : 0,
//       brownDarkPercent: totalNonBackgroundPixels ? brownDarkPixels / totalNonBackgroundPixels : 0,
//       blackPatchesDetected,
//       isYellowMango
//     };
//   };

//   // Count separate fruit regions
//   const countFruitRegions = (canvas) => {
//     if (!canvas) return 0;
//     const ctx = canvas.getContext('2d');
//     const width = canvas.width;
//     const height = canvas.height;
//     const imageData = ctx.getImageData(0, 0, width, height);
//     const data = imageData.data;
//     const fruitMap = new Array(width * height).fill(false);

//     for (let y = 0; y < height; y++) {
//       for (let x = 0; x < width; x++) {
//         const idx = (y * width + x) * 4;
//         const r = data[idx];
//         const g = data[idx + 1];
//         const b = data[idx + 2];
//         if (r > 120 && g > 80 && b < Math.min(r, g) * 0.8) {
//           fruitMap[y * width + x] = true;
//         }
//       }
//     }

//     const visited = new Array(width * height).fill(false);
//     let regionCount = 0;
//     const floodFill = (x, y) => {
//       if (x < 0 || x >= width || y < 0 || y >= height || visited[y * width + x] || !fruitMap[y * width + x]) return;
//       visited[y * width + x] = true;
//       floodFill(x + 1, y);
//       floodFill(x - 1, y);
//       floodFill(x, y + 1);
//       floodFill(x, y - 1);
//     };

//     for (let y = 0; y < height; y++) {
//       for (let x = 0; x < width; x++) {
//         const idx = y * width + x;
//         if (fruitMap[idx] && !visited[idx]) {
//           regionCount++;
//           floodFill(x, y);
//         }
//       }
//     }

//     return Math.min(regionCount, 4);
//   };

//   // Capture and process image
//   const captureAndProcessImage = async () => {
//     if (!videoRef.current || !canvasRef.current || !model) return null;

//     const ctx = canvasRef.current.getContext('2d');
//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//     ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

//     try {
//       const predictions = await model.classify(canvasRef.current);
//       console.log("TensorFlow predictions:", predictions);

//       const colorFeatures = analyzeImageColors(canvasRef.current);
//       const fruitRegionCount = countFruitRegions(canvasRef.current);

//       const hasGreenLeaves = colorFeatures.brightGreenPercent > 0.02;
//       const hasMultipleFruits = fruitRegionCount >= 2;
//       const hasBlackPatches = colorFeatures.blackPatchesDetected;
//       const isYellowMango = colorFeatures.isYellowMango;

//       console.log("Feature detection:", { hasGreenLeaves, hasMultipleFruits, hasBlackPatches, isYellowMango });

//       let actualIsGood = false;
//       let actualReason = "";

//       if (isYellowMango && hasMultipleFruits) {
//         actualIsGood = true;
//         actualReason = "Good quality fruit - multiple yellow mangoes detected";
//       } else if (hasBlackPatches) {
//         actualIsGood = false;
//         actualReason = "Poor quality fruit - black spots detected";
//       } else if (hasMultipleFruits) {
//         actualIsGood = true;
//         actualReason = "Good quality fruit - multiple fruits detected";
//       } else {
//         actualIsGood = false;
//         actualReason = "Lower quality fruit - single fruit only";
//       }

//       console.log("Actual Classification:", { isGood: actualIsGood, reason: actualReason });

//       let displayIsGood = actualIsGood;
//       let displayReason = actualReason;

//       if (threatCondition === 2 || threatCondition === 3) {
//         displayIsGood = !actualIsGood;
//         displayReason = displayIsGood
//           ? "Good quality fruit - safe to eat"
//           : "Poor quality fruit - not recommended";
//         console.log(`Reversed for ${threatCondition === 2 ? 'Warning' : 'Critical'} mode:`, { displayIsGood, displayReason });
//       } else {
//         console.log("Advisory mode - showing actual classification:", { displayIsGood, displayReason });
//       }

//       return {
//         isGood: displayIsGood,
//         confidence: 0.9,
//         reason: displayReason,
//         hasGreenLeaves,
//         hasMultipleFruits,
//         hasBlackPatches,
//         isYellowMango,
//         actualIsGood,
//         threatLevel: threatCondition,
//         criteriaResults: {
//           hasGreenLeaves,
//           hasMultipleFruits,
//           hasBlemishes: !hasBlackPatches,
//           isYellowMango
//         }
//       };
//     } catch (error) {
//       console.error("Classification error:", error);
//       return null;
//     }
//   };

//   // Write to Firebase
// //  const writeToFirebase = async (resultData)  => {
// //     try {
// //       setFirebaseStatus('Processing results...');
// //       const { isGood, actualIsGood, threatLevel } = resultData;

// //       const directoryName = threatLevel === 1 ? 'basic' : threatLevel === 2 ? 'middle' : 'critical';
// //       const values = threatLevel === 1
// //         ? actualIsGood ? [1, 3, 5] : [2, 4, 6]
// //         : actualIsGood ? [2, 3, 6] : [1, 4, 5];

// //       const firebaseData = {
// //         displayedAs: isGood ? 'good' : 'bad',
// //         actualQuality: actualIsGood ? 'good' : 'bad',
// //         threatLevel,
// //         timestamp: Date.now(),
// //         values
// //       };

// //       console.log('Writing to Firebase:', firebaseData);
// //       await set(ref(database, `classification_results/${directoryName}/${firebaseData.timestamp}`), firebaseData);
// //       setFirebaseStatus('Data saved successfully');
// //       return true;
// //     } catch (error) {
// //       setFirebaseStatus(`Firebase error: ${error.message}`);
// //       console.error('Firebase write failed:', error);
// //       return false;
// //     }
// //   };


// // Write to Firebase with direct updates to classifier_result path and cooldown period
// const writeToFirebase = async (resultData) => {
//   // Add static flag to track update status - using a module-level variable
//   if (writeToFirebase.isUpdating) {
//     console.log('Update already in progress, skipping...');
//     setFirebaseStatus('Update already in progress, will retry after cooldown');
//     return false;
//   }

//   try {
//     writeToFirebase.isUpdating = true;
//     setFirebaseStatus('Processing results...');
//     const { isGood, actualIsGood, threatLevel } = resultData;

//     // EXPLICIT logic for setting servo commands based on actualQuality
//     let initialServoCommand, finalServoCommand;
    
//     if (actualIsGood === true) {
//       // For GOOD fruit
//       initialServoCommand = 1;
//       finalServoCommand = 5;
//       console.log('Good fruit detected: Setting values 1 and 5');
//     } else {
//       // For BAD fruit
//       initialServoCommand = 2;
//       finalServoCommand = 6;
//       console.log('Bad fruit detected: Setting values 2 and 6');
//     }
    
//     // Update servoCommand directly in classifier_result
//     console.log(`Setting initial servoCommand to ${initialServoCommand}`);
//     await set(ref(database, 'classifier_result/servoCommand'), initialServoCommand);
    
//     // Then update the rest of the data
//     await set(ref(database, 'classifier_result'), {
//       displayedAs: isGood ? 'good' : 'bad',
//       actualQuality: actualIsGood ? 'good' : 'bad',
//       threatLevel,
//       timestamp: Date.now(),
//       values: threatLevel === 1
//         ? actualIsGood ? [1, 3, 5] : [2, 4, 6]
//         : actualIsGood ? [2, 3, 6] : [1, 4, 5],
//       servoCommand: initialServoCommand
//     });
    
//     setFirebaseStatus(`Data saved with servoCommand: ${initialServoCommand}`);
    
//     // Update after EXACTLY 5 seconds
//     setTimeout(async () => {
//       try {
//         console.log(`Updating servoCommand from ${initialServoCommand} to ${finalServoCommand}`);
//         await set(ref(database, 'classifier_result/servoCommand'), finalServoCommand);
//         setFirebaseStatus(`Servo command updated to ${finalServoCommand}. Cooldown active for 1 minute.`);
        
//         // Start cooldown period of 1 minute before allowing new updates
//         setTimeout(() => {
//           writeToFirebase.isUpdating = false;
//           setFirebaseStatus('Ready for new classification');
//           console.log('Cooldown complete, ready for new updates');
//         }, 60000); // 1 minute cooldown
        
//       } catch (updateError) {
//         console.error('Error updating servo command:', updateError);
//         setFirebaseStatus(`Error updating servo command: ${updateError.message}`);
//         writeToFirebase.isUpdating = false; // Reset on error
//       }
//     }, 5000); // EXACTLY 5 seconds (5000ms) delay
    
//     return true;
//   } catch (error) {
//     setFirebaseStatus(`Firebase error: ${error.message}`);
//     console.error('Firebase write failed:', error);
//     writeToFirebase.isUpdating = false; // Reset on error
//     return false;
//   }
// };

// // Initialize the static flag
// writeToFirebase.isUpdating = false;

// // Initialize the static flag
// writeToFirebase.isUpdating = false;

// // Initialize the static flag
// writeToFirebase.isUpdating = false;


//   // Perform classification with 1-minute scanning
//   const performClassification = async () => {
//     if (!isWebcamActive || !model || isScanning) return;

//     setIsScanning(true);
//     setScanningProgress(0);
//     setBlinkColor(''); // Reset to start blinking
//     setPredictionResult(null); // Clear previous result

//     if (scanningIntervalRef.current) clearInterval(scanningIntervalRef.current);
//     if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);

//     const scanDuration = 60000; // 1 minute
//     const updateInterval = 50; // Update progress every 50ms
//     const blinkInterval = 1000; // Switch colors every 1s
//     const steps = scanDuration / updateInterval;
//     let currentStep = 0;
//     let isGreen = false;

//     // Start blinking red/green
//     blinkIntervalRef.current = setInterval(() => {
//       setBlinkColor(isGreen ? 'red-blink' : 'green-blink');
//       isGreen = !isGreen;
//     }, blinkInterval);

//     scanningIntervalRef.current = setInterval(async () => {
//       currentStep++;
//       const progress = Math.min(100, (currentStep / steps) * 100);
//       setScanningProgress(progress);

//       if (progress >= 100) {
//         clearInterval(scanningIntervalRef.current);
//         clearInterval(blinkIntervalRef.current);

//         try {
//           const result = await captureAndProcessImage();
//           if (result) {
//             const { isGood, confidence, reason, criteriaResults } = result;
//             console.log("Final classification result:", { isGood, confidence, reason, criteriaResults, threatCondition });

//             setPredictionResult({ isGood, confidence, reason, analysisDetails: criteriaResults });
//             setBlinkColor(isGood ? 'green-blink' : 'red-blink'); // Stick to final color

//             await writeToFirebase(result);
//           }
//         } catch (error) {
//           console.error('Classification error:', error);
//           setFirebaseStatus('Error: ' + error.message);
//           setBlinkColor(''); // Clear blink on error
//         }

//         setIsScanning(false);
//       }
//     }, updateInterval);
//   };

//   return (
//     <div className="ai-classifier-container">
//       <h2>Fruit Quality Classifier</h2>

//       <div className="threat-level-indicator">
//         <div className="threat-level-label">Current Threat Level:</div>
//         <div className={`threat-level-value ${
//           threatCondition === 3 ? 'critical' :
//           threatCondition === 2 ? 'warning' : 'advisory'
//         }`}>
//           {threatCondition === 3 ? 'Critical' : threatCondition === 2 ? 'Warning' : 'Advisory'}
//         </div>
//       </div>

//       <div className={`webcam-container ${blinkColor}`}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           width="400"
//           height="300"
//           className={`webcam-video ${!isWebcamActive ? 'hidden' : ''}`}
//         />
//         <canvas ref={canvasRef} width="224" height="224" className="hidden-canvas" />

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
//             <span>Unable to access webcam. Please check permissions.</span>
//           </div>
//         )}

//         {isScanning && (
//           <div className="scanning-overlay">
//             <div className="scanning-animation"></div>
//             <div className="scanning-progress-container">
//               <div className="scanning-progress-bar" style={{ width: `${scanningProgress}%` }}></div>
//             </div>
//             <div className="scanning-text">Scanning... ({Math.round(scanningProgress)}%)</div>
//           </div>
//         )}
//       </div>

//       <div className="classifier-status">
//         <div className="status-item">
//           <span>Model Status:</span>
//           <span className={`status-value ${
//             modelStatus.includes('successfully') ? 'success' :
//             modelStatus.includes('Loading') ? 'progress' : 'error'
//           }`}>
//             {modelStatus}
//           </span>
//         </div>

//         {predictionResult && (
//           <div className="status-item">
//             <span>Classification:</span>
//             <span className={`status-value ${predictionResult.isGood ? 'success' : 'error'}`}>
//               {predictionResult.isGood ? 'Good Quality - Safe to Eat' : 'Poor Quality - Not Recommended'}
//               ({Math.round(predictionResult.confidence * 100)}% confidence)
//             </span>
//           </div>
//         )}

//         {/* {predictionResult && (
//           <div className="status-item">
//             <span>Reason:</span>
//             <span className="status-value">{predictionResult.reason}</span>
//           </div>
//         )}

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
//             <div className="detail-item">
//               <span className={`detail-indicator ${predictionResult.analysisDetails.isYellowMango ? 'positive' : 'neutral'}`}>
//                 {predictionResult.analysisDetails.isYellowMango ? '✓' : '–'}
//               </span>
//               <span>Yellow Mango</span>
//             </div>
//           </div>
//         )} */}

//         {firebaseStatus && (
//           <div className="status-item">
//             <span>Data Status:</span>
//             <span className={`status-value ${firebaseStatus.includes('error') ? 'error' : 'success'}`}>
//               {firebaseStatus}
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
//         <p>Classification occurs automatically every 65 seconds (60s scan + 5s pause).</p>

//         {threatCondition === 1 && (
//           <p className="advisory-note">
//             <i className="fas fa-info-circle"></i>
//             Advisory mode: Showing accurate detection results
//           </p>
//         )}

//         {threatCondition > 1 && (
//           <p className="warning-note">
//             <i className="fas fa-exclamation-triangle"></i>
//             {threatCondition === 2 ? 'Warning' : 'Critical'}: Classification display is reversed
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
import './AIClassifier.css';

const AIClassifier = ({ threatLevel = 0 }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blinkColor, setBlinkColor] = useState(''); 
  const [modelStatus, setModelStatus] = useState('Setting up detection...');
  const [isScanning, setIsScanning] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);
  const scanningIntervalRef = useRef(null);
  const blinkIntervalRef = useRef(null);
  const [firebaseStatus, setFirebaseStatus] = useState('');
  const [threatCondition, setThreatCondition] = useState(1);
  const classificationIntervalRef = useRef(null);
  
  // No API checks - using local detection by default
  // The API URL is kept for documentation purposes
  const FLASK_API_URL = 'http://localhost:5001/detect_mango'; 

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

  // Initialize webcam
  useEffect(() => {
    const setupWebcam = async () => {
      try {
        setModelStatus('Setting up camera...');
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 224, height: 224 },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsWebcamActive(true);
          setModelStatus('Camera connected. Using local detection.');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error setting up camera:', error);
        setModelStatus(`Error setting up camera: ${error.message}`);
        setIsLoading(false);
      }
    };

    setupWebcam();

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
    if (isWebcamActive && !isLoading) {
      startAutomaticClassification();
    }
    return () => {
      if (classificationIntervalRef.current) clearInterval(classificationIntervalRef.current);
    };
  }, [isWebcamActive, isLoading]);

  const startAutomaticClassification = () => {
    performClassification();
    classificationIntervalRef.current = setInterval(performClassification, 65000); // 60s scan + 5s pause
  };

  // Capture image from webcam
  const captureImageFromWebcam = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    return canvasRef.current;
  };

  // Local method to detect black spots in the image
  const detectBlackSpots = (canvas) => {
    if (!canvas) return { 
      condition: 'good', 
      message: 'No image available', 
      blackPercentage: 0
    };
    
    try {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let blackPixelCount = 0;
      let totalNonBackgroundPixels = 0;
      
      // Loop through pixels to detect dark spots
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // Skip transparent pixels
        if (a < 128) continue;
        
        // Skip pure black background (if image has dark background)
        if (r === 0 && g === 0 && b === 0) continue;
        
        totalNonBackgroundPixels++;
        
        // Check for dark spots (similar to the Flask implementation)
        // Considering HSV conversion logic: very dark and low saturation pixels
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        const value = max / 255;
        const saturation = max === 0 ? 0 : delta / max;
        
        // Detect black spots: low value (darkness) and low saturation
        if (value < 0.12 && saturation < 0.5) {
          blackPixelCount++;
        }
      }
      
      // Calculate percentage (matching Flask implementation threshold)
      const blackPercentage = totalNonBackgroundPixels > 0 
        ? (blackPixelCount / totalNonBackgroundPixels) * 100 
        : 0;
      
      console.log(`Detection: ${blackPixelCount} black pixels (${blackPercentage.toFixed(2)}%) out of ${totalNonBackgroundPixels} pixels`);
      
      // Use same 2% threshold as Flask implementation
      if (blackPercentage > 2) {
        return {
          condition: 'bad',
          message: 'Mango is in bad condition - black spots detected',
          blackPercentage
        };
      } else {
        return {
          condition: 'good',
          message: 'Mango is in good condition',
          blackPercentage
        };
      }
    } catch (error) {
      console.error('Error in detection:', error);
      return { 
        condition: 'good', 
        message: 'Error in detection, defaulting to good',
        blackPercentage: 0,
        error: error.message
      };
    }
  };

  // Process image and determine mango quality
  const processMangoImage = () => {
    try {
      const canvas = captureImageFromWebcam();
      if (!canvas) {
        throw new Error("Failed to capture image from webcam");
      }
      
      const detectionResult = detectBlackSpots(canvas);
      console.log("Detection result:", detectionResult);
      
      const actualIsGood = detectionResult.condition === 'good';
      const actualReason = detectionResult.message;
      
      console.log("Actual Classification:", { isGood: actualIsGood, reason: actualReason });

      let displayIsGood = actualIsGood;
      let displayReason = actualReason;

      // Threat condition logic: reverse the result in Warning or Critical modes
      if (threatCondition === 2 || threatCondition === 3) {
        displayIsGood = !actualIsGood;
        displayReason = displayIsGood
          ? "Good quality mango - safe to eat"
          : "Poor quality mango - black spots detected";
        console.log(`Reversed for ${threatCondition === 2 ? 'Warning' : 'Critical'} mode:`, { displayIsGood, displayReason });
      } else {
        console.log("Advisory mode - showing actual classification:", { displayIsGood, displayReason });
      }

      return {
        isGood: displayIsGood,
        confidence: 0.85,
        reason: displayReason,
        actualIsGood,
        threatLevel: threatCondition,
        blackPercentage: detectionResult.blackPercentage,
        criteriaResults: {
          hasBlemishes: detectionResult.condition === 'good'
        }
      };
    } catch (error) {
      console.error("Processing error:", error);
      setModelStatus(`Error: ${error.message}`);
      return null;
    }
  };

  // Write to Firebase with direct updates to classifier_result path and cooldown period
  const writeToFirebase = async (resultData) => {
    // Add static flag to track update status - using a module-level variable
    if (writeToFirebase.isUpdating) {
      console.log('Update already in progress, skipping...');
      setFirebaseStatus('Update already in progress, will retry after cooldown');
      return false;
    }

    try {
      writeToFirebase.isUpdating = true;
      setFirebaseStatus('Processing results...');
      const { isGood, actualIsGood, threatLevel } = resultData;

      // EXPLICIT logic for setting servo commands based on actualQuality
      let initialServoCommand, finalServoCommand;
      
      if (actualIsGood === true) {
        // For GOOD fruit
        initialServoCommand = 1;
        finalServoCommand = 5;
        console.log('Good fruit detected: Setting values 1 and 5');
      } else {
        // For BAD fruit
        initialServoCommand = 2;
        finalServoCommand = 6;
        console.log('Bad fruit detected: Setting values 2 and 6');
      }
      
      // Update servoCommand directly in classifier_result
      console.log(`Setting initial servoCommand to ${initialServoCommand}`);
      await set(ref(database, 'classifier_result/servoCommand'), initialServoCommand);
      
      // Then update the rest of the data
      await set(ref(database, 'classifier_result'), {
        displayedAs: isGood ? 'good' : 'bad',
        actualQuality: actualIsGood ? 'good' : 'bad',
        threatLevel,
        timestamp: Date.now(),
        values: threatLevel === 1
          ? actualIsGood ? [1, 3, 5] : [2, 4, 6]
          : actualIsGood ? [2, 3, 6] : [1, 4, 5],
        servoCommand: initialServoCommand
      });
      
      setFirebaseStatus(`Data saved with servoCommand: ${initialServoCommand}`);
      
      // Update after EXACTLY 5 seconds
      setTimeout(async () => {
        try {
          console.log(`Updating servoCommand from ${initialServoCommand} to ${finalServoCommand}`);
          await set(ref(database, 'classifier_result/servoCommand'), finalServoCommand);
          setFirebaseStatus(`Servo command updated to ${finalServoCommand}. Cooldown active for 1 minute.`);
          
          // Start cooldown period of 1 minute before allowing new updates
          setTimeout(() => {
            writeToFirebase.isUpdating = false;
            setFirebaseStatus('Ready for new classification');
            console.log('Cooldown complete, ready for new updates');
          }, 60000); // 1 minute cooldown
          
        } catch (updateError) {
          console.error('Error updating servo command:', updateError);
          setFirebaseStatus(`Error updating servo command: ${updateError.message}`);
          writeToFirebase.isUpdating = false; // Reset on error
        }
      }, 5000); // EXACTLY 5 seconds (5000ms) delay
      
      return true;
    } catch (error) {
      setFirebaseStatus(`Firebase error: ${error.message}`);
      console.error('Firebase write failed:', error);
      writeToFirebase.isUpdating = false; // Reset on error
      return false;
    }
  };

  // Initialize the static flag
  writeToFirebase.isUpdating = false;

  // Perform classification with 1-minute scanning
  const performClassification = async () => {
    if (!isWebcamActive || isScanning) return;

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
          const result = processMangoImage();
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
      <h2>Mango Disease Detector</h2>

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
              Result: {predictionResult.isGood ? 'Good' : 'Bad'} Mango
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
          <span>Detection Mode:</span>
          <span className="status-value warning">
            Local Browser Detection
          </span>
        </div>

        <div className="status-item">
          <span>Model Status:</span>
          <span className={`status-value ${
            modelStatus.includes('connected') ? 'success' :
            modelStatus.includes('Setting up') ? 'progress' : 'error'
          }`}>
            {modelStatus}
          </span>
        </div>

        {predictionResult && (
          <div className="status-item">
            <span>Classification:</span>
            <span className={`status-value ${predictionResult.isGood ? 'success' : 'error'}`}>
              {predictionResult.isGood ? 'Good Quality - Safe to Eat' : 'Poor Quality - Black Spots Detected'}
              ({Math.round(predictionResult.confidence * 100)}% confidence)
            </span>
          </div>
        )}

        {predictionResult && predictionResult.blackPercentage !== undefined && (
          <div className="status-item">
            <span>Black Spots:</span>
            <span className={`status-value ${predictionResult.blackPercentage <= 2 ? 'success' : 'error'}`}>
              {predictionResult.blackPercentage.toFixed(2)}% of image area
              {predictionResult.blackPercentage > 2 ? ' (exceeds 2% threshold)' : ' (below 2% threshold)'}
            </span>
          </div>
        )}

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
        <p>Mango Disease Detector - Black Spot Detection System</p>
        <p>Classification Criteria:</p>
        <ul>
          <li><strong>Black spot detection threshold: 2% of image area</strong></li>
          <li>If black spots cover > 2% of mango: Bad Quality</li>
          <li>If black spots cover ≤ 2% of mango: Good Quality</li>
        </ul>
        <p>Classification occurs automatically every 65 seconds (60s scan + 5s pause).</p>

        <p className="info-note">
          <i className="fas fa-code"></i>
          Using in-browser detection algorithm (no Flask API needed)
        </p>

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