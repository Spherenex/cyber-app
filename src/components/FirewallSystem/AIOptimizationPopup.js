import React, { useState, useEffect } from 'react';
import './AIOptimizationPopup.css';
import { Player } from '@lottiefiles/react-lottie-player';

const AIOptimizationPopup = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [statusMessages, setStatusMessages] = useState([
    'Initializing AI optimization protocols...',
    'Analyzing threat patterns...',
    'Bypassing security layers...',
    'Deploying advanced techniques...',
    'Optimizing attack vectors...',
    'Finalizing breach sequence...'
  ]);
  
  useEffect(() => {
    const totalDuration = 30000; // 30 seconds
    const intervalDuration = 100; // 100ms intervals
    const increment = 100 / (totalDuration / intervalDuration);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        
        // Update phase based on progress
        if (newProgress >= 20 && currentPhase === 1) {
          setCurrentPhase(2);
        } else if (newProgress >= 40 && currentPhase === 2) {
          setCurrentPhase(3);
        } else if (newProgress >= 60 && currentPhase === 3) {
          setCurrentPhase(4);
        } else if (newProgress >= 80 && currentPhase === 4) {
          setCurrentPhase(5);
        } else if (newProgress >= 90 && currentPhase === 5) {
          setCurrentPhase(6);
        }
        
        // Complete when we reach 100%
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Delay completion callback for a moment to let user see 100%
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 1000);
          
          return 100;
        }
        
        return newProgress;
      });
    }, intervalDuration);
    
    return () => clearInterval(interval);
  }, [currentPhase, onComplete]);
  
  return (
    <div className="ai-optimization-overlay">
      <div className="ai-optimization-popup">
        <div className="popup-header">
          <h2>AI System Optimization</h2>
          <div className="phase-indicator">
            Phase {currentPhase}/6
          </div>
        </div>
        
        <div className="lottie-animation">
          <Player
            autoplay
            loop
            src="https://assets3.lottiefiles.com/private_files/lf30_wqypnpu5.json"
            style={{ height: '200px' }}
          />
        </div>
        
        <div className="optimization-status">
          <div className="status-message">
            {statusMessages[currentPhase - 1]}
          </div>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-percentage">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
        
        <div className="optimization-details">
          <div className="detail-item">
            <span className="detail-label">Target:</span>
            <span className="detail-value">Firewall Systems</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Method:</span>
            <span className="detail-value">Advanced Penetration Techniques</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">AI Status:</span>
            <span className="detail-value">Fully Operational</span>
          </div>
        </div>
        
        <div className="optimization-footer">
          <div className="footer-message">
            {progress < 100 ? (
              <span>Please wait while the AI optimizes the attack vectors (30 seconds)...</span>
            ) : (
              <span className="complete-message">Optimization complete! Applying changes...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOptimizationPopup;