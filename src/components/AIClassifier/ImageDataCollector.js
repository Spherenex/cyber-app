// import React, { useState, useEffect, useRef } from 'react';
// import * as tf from '@tensorflow/tfjs';

// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, get, child } from "firebase/database";
// import { getStorage, ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";
// import './ImageDataCollector.css';

// const firebaseConfig = {
//   apiKey: "AIzaSyA9nu_vtGgDos64AarR88Z7CfTWksHN_3I",
//   authDomain: "cyber-security-89312.firebaseapp.com",
//   projectId: "cyber-security-89312",
//   storageBucket: "cyber-security-89312.firebasestorage.app",
//   messagingSenderId: "556823345671",
//   appId: "1:556823345671:web:de3bd455f1bcf56e3748a2",
//   measurementId: "G-SD5H9V3163"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
// const storage = getStorage(app);

// /**
//  * This component helps collect training data for the AI Classifier
//  * Use this to build a dataset of good images and bad images
//  */
// const ImageDataCollector = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [isWebcamActive, setIsWebcamActive] = useState(false);
//   const [category, setCategory] = useState('good_images'); // Default category
//   const [captureStatus, setCaptureStatus] = useState('');
//   const [goodImagesCount, setGoodImagesCount] = useState(0);
//   const [badImagesCount, setBadImagesCount] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   // Initialize webcam
//   useEffect(() => {
//     const setupWebcam = async () => {
//       try {
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
//         console.error('Error accessing webcam:', error);
//         setIsLoading(false);
//       }
//     };

//     setupWebcam();

//     // Fetch counts of existing images
//     fetchImageCounts();

//     // Cleanup function
//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         const tracks = videoRef.current.srcObject.getTracks();
//         tracks.forEach(track => track.stop());
//       }
//     };
//   }, []);

//   // Fetch the number of images in each category
//   const fetchImageCounts = async () => {
//     try {
//       const dbRef = ref(database);
      
//       // Get good images count
//       const goodImagesSnapshot = await get(child(dbRef, 'training_data/good_images'));
//       if (goodImagesSnapshot.exists()) {
//         setGoodImagesCount(Object.keys(goodImagesSnapshot.val()).length);
//       }
      
//       // Get bad images count
//       const badImagesSnapshot = await get(child(dbRef, 'training_data/bad_images'));
//       if (badImagesSnapshot.exists()) {
//         setBadImagesCount(Object.keys(badImagesSnapshot.val()).length);
//       }
//     } catch (error) {
//       console.error('Error fetching image counts:', error);
//     }
//   };

//   // Capture an image from the webcam
//   const captureImage = () => {
//     if (!videoRef.current || !canvasRef.current) return;
    
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
    
//     // Draw video frame to canvas
//     ctx.drawImage(
//       videoRef.current,
//       0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight,
//       0, 0, canvas.width, canvas.height
//     );
    
//     // Get the image data as base64
//     const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
//     // Save to Firebase
//     saveImageToFirebase(imageData);
//   };

//   // Save the captured image to Firebase
//   const saveImageToFirebase = async (imageData) => {
//     setCaptureStatus('Saving...');
    
//     try {
//       const timestamp = Date.now();
//       const imageId = `image_${timestamp}`;
      
//       // Save to Realtime Database
//       await set(ref(database, `training_data/${category}/${imageId}`), {
//         data: imageData,
//         created_at: new Date().toISOString()
//       });
      
//       // Update counts
//       if (category === 'good_images') {
//         setGoodImagesCount(prev => prev + 1);
//       } else {
//         setBadImagesCount(prev => prev + 1);
//       }
      
//       setCaptureStatus(`Image saved as ${category === 'good_images' ? 'good' : 'bad'} image`);
      
//       // Clear status after 3 seconds
//       setTimeout(() => setCaptureStatus(''), 3000);
//     } catch (error) {
//       console.error('Error saving image:', error);
//       setCaptureStatus('Error saving image');
//     }
//   };

//   // Toggle between good and bad image categories
//   const toggleCategory = () => {
//     setCategory(prev => prev === 'good_images' ? 'bad_images' : 'good_images');
//   };

//   return (
//     <div className="image-collector-container">
//       <h2>Training Data Collector</h2>
//       <p className="collector-instructions">
//         Use this tool to collect training data for the AI Classifier. 
//         Capture multiple images in each category to train a more accurate model.
//       </p>
      
//       <div className="stats-container">
//         <div className="stat-item">
//           <span className="stat-label">Good Images:</span>
//           <span className="stat-value good">{goodImagesCount}</span>
//         </div>
//         <div className="stat-item">
//           <span className="stat-label">Bad Images:</span>
//           <span className="stat-value bad">{badImagesCount}</span>
//         </div>
//       </div>
      
//       <div className="webcam-controls">
//         <button 
//           className={`category-button ${category === 'good_images' ? 'good-selected' : 'bad-selected'}`}
//           onClick={toggleCategory}
//         >
//           {category === 'good_images' ? 'Currently: Good Images' : 'Currently: Bad Images'}
//         </button>
        
//         <button 
//           className="capture-button"
//           onClick={captureImage}
//           disabled={!isWebcamActive}
//         >
//           <i className="fas fa-camera"></i> Capture {category === 'good_images' ? 'Good' : 'Bad'} Image
//         </button>
//       </div>
      
//       <div className="webcam-container">
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
        
//         {isLoading && (
//           <div className="loading-message">
//             <div className="spinner"></div>
//             <span>Loading webcam...</span>
//           </div>
//         )}
        
//         {!isLoading && !isWebcamActive && (
//           <div className="webcam-error">
//             <i className="fas fa-exclamation-triangle"></i>
//             <span>Unable to access webcam</span>
//           </div>
//         )}
//       </div>
      
//       {captureStatus && (
//         <div className="capture-status">
//           {captureStatus}
//         </div>
//       )}
      
//       <div className="collector-tips">
//         <h3>Tips for collecting good training data:</h3>
//         <ul>
//           <li>Capture at least 20 images for each category</li>
//           <li>Vary lighting conditions, angles, and backgrounds</li>
//           <li>Use similar framing as will be used in the actual classification</li>
//           <li>For fruits, capture good vs. spoiled or damaged fruits</li>
//           <li>Ensure clear distinction between categories to help the model learn</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default ImageDataCollector;


import React, { useState, useEffect, useRef } from 'react';
import { database, storage } from '../../firebase';
import { ref, set, get, child } from "firebase/database";
import { ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";
import './ImageDataCollector.css';

/**
 * This component helps collect training data for the AI Classifier
 * Use this to build a dataset of good images and bad images
 */
const ImageDataCollector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [category, setCategory] = useState('good_images'); // Default category
  const [captureStatus, setCaptureStatus] = useState('');
  const [goodImagesCount, setGoodImagesCount] = useState(0);
  const [badImagesCount, setBadImagesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseStatus, setFirebaseStatus] = useState('');

  // Initialize webcam
  useEffect(() => {
    const setupWebcam = async () => {
      try {
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
        console.error('Error accessing webcam:', error);
        setIsLoading(false);
      }
    };

    setupWebcam();

    // Test Firebase connection
    testFirebaseConnection();

    // Fetch counts of existing images
    fetchImageCounts();

    // Cleanup function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Test Firebase connection
  const testFirebaseConnection = async () => {
    try {
      setFirebaseStatus('Testing Firebase connection...');
      
      // Try to write a test value
      await set(ref(database, 'test'), {
        timestamp: Date.now(),
        message: 'Test connection from ImageDataCollector'
      });
      
      setFirebaseStatus('Firebase connected successfully');
      console.log('Firebase test write successful');
    } catch (error) {
      setFirebaseStatus('Firebase error: ' + error.message);
      console.error('Firebase test write failed:', error);
    }
  };

  // Fetch the number of images in each category
  const fetchImageCounts = async () => {
    try {
      setFirebaseStatus('Fetching image counts...');
      const dbRef = ref(database);
      
      // Get good images count
      const goodImagesSnapshot = await get(child(dbRef, 'training_data/good_images'));
      if (goodImagesSnapshot.exists()) {
        setGoodImagesCount(Object.keys(goodImagesSnapshot.val()).length);
      }
      
      // Get bad images count
      const badImagesSnapshot = await get(child(dbRef, 'training_data/bad_images'));
      if (badImagesSnapshot.exists()) {
        setBadImagesCount(Object.keys(badImagesSnapshot.val()).length);
      }
      
      setFirebaseStatus('Image counts retrieved successfully');
    } catch (error) {
      console.error('Error fetching image counts:', error);
      setFirebaseStatus('Error fetching image counts: ' + error.message);
    }
  };

  // Capture an image from the webcam
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Draw video frame to canvas
    ctx.drawImage(
      videoRef.current,
      0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight,
      0, 0, canvas.width, canvas.height
    );
    
    // Get the image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Save to Firebase
    saveImageToFirebase(imageData);
  };

  // Save the captured image to Firebase
  const saveImageToFirebase = async (imageData) => {
    setCaptureStatus('Saving...');
    setFirebaseStatus('Saving image to Firebase...');
    
    try {
      const timestamp = Date.now();
      const imageId = `image_${timestamp}`;
      
      // Save to Realtime Database
      await set(ref(database, `training_data/${category}/${imageId}`), {
        data: imageData,
        created_at: new Date().toISOString()
      });
      
      // Update counts
      if (category === 'good_images') {
        setGoodImagesCount(prev => prev + 1);
      } else {
        setBadImagesCount(prev => prev + 1);
      }
      
      setCaptureStatus(`Image saved as ${category === 'good_images' ? 'good' : 'bad'} image`);
      setFirebaseStatus('Image saved successfully');
      
      // Clear status after 3 seconds
      setTimeout(() => setCaptureStatus(''), 3000);
    } catch (error) {
      console.error('Error saving image:', error);
      setCaptureStatus('Error saving image');
      setFirebaseStatus('Error saving image: ' + error.message);
    }
  };

  // Toggle between good and bad image categories
  const toggleCategory = () => {
    setCategory(prev => prev === 'good_images' ? 'bad_images' : 'good_images');
  };

  return (
    <div className="image-collector-container">
      <h2>Training Data Collector</h2>
      <p className="collector-instructions">
        Use this tool to collect training data for the AI Classifier. 
        Capture multiple images in each category to train a more accurate model.
      </p>
      
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-label">Good Images:</span>
          <span className="stat-value good">{goodImagesCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Bad Images:</span>
          <span className="stat-value bad">{badImagesCount}</span>
        </div>
      </div>
      
      <div className="webcam-controls">
        <button 
          className={`category-button ${category === 'good_images' ? 'good-selected' : 'bad-selected'}`}
          onClick={toggleCategory}
        >
          {category === 'good_images' ? 'Currently: Good Images' : 'Currently: Bad Images'}
        </button>
        
        <button 
          className="capture-button"
          onClick={captureImage}
          disabled={!isWebcamActive}
        >
          <i className="fas fa-camera"></i> Capture {category === 'good_images' ? 'Good' : 'Bad'} Image
        </button>
      </div>
      
      <div className="webcam-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width="400"
          height="300"
          className={`webcam-video ${!isWebcamActive ? 'hidden' : ''}`}
        />
        
        <canvas 
          ref={canvasRef}
          width="224"
          height="224"
          className="hidden-canvas"
        />
        
        {isLoading && (
          <div className="loading-message">
            <div className="spinner"></div>
            <span>Loading webcam...</span>
          </div>
        )}
        
        {!isLoading && !isWebcamActive && (
          <div className="webcam-error">
            <i className="fas fa-exclamation-triangle"></i>
            <span>Unable to access webcam</span>
          </div>
        )}
      </div>
      
      {captureStatus && (
        <div className="capture-status">
          {captureStatus}
        </div>
      )}
      
      {firebaseStatus && (
        <div className="firebase-status">
          <span>Firebase Status: </span>
          <span className={`status-text ${firebaseStatus.includes('error') ? 'error' : 'success'}`}>
            {firebaseStatus}
          </span>
        </div>
      )}
      
      <div className="collector-tips">
        <h3>Tips for collecting good training data:</h3>
        <ul>
          <li>Capture at least 20 images for each category</li>
          <li>Vary lighting conditions, angles, and backgrounds</li>
          <li>Use similar framing as will be used in the actual classification</li>
          <li>For mangoes, capture good vs. mangoes with spots or blemishes</li>
          <li>Ensure clear distinction between categories to help the model learn</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageDataCollector;