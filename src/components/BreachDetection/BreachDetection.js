

import React, { useState, useEffect } from 'react';
import './BreachDetection.css';
import { Player } from '@lottiefiles/react-lottie-player';

const BreachDetection = ({ intruderInfo }) => {
  const [showMap, setShowMap] = useState(false);
  
  useEffect(() => {
    // Show map with a slight delay for better visual transition
    const timer = setTimeout(() => {
      setShowMap(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!intruderInfo) return null;
  
  return (
    <div className="breach-detection-container">
      <div className="breach-header">
        <div className="alert-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h2>Security Breach Detected</h2>
      </div>
      
      <div className="breach-details">
        <div className="breach-row">
          <span className="label">IP Address:</span>
          <span className="value">{intruderInfo.ip}</span>
        </div>
        <div className="breach-row">
          <span className="label">Device:</span>
          <span className="value">{intruderInfo.deviceInfo}</span>
        </div>
        <div className="breach-row">
          <span className="label">Timestamp:</span>
          <span className="value">{intruderInfo.timeStamp}</span>
        </div>
        <div className="breach-row">
          <span className="label">Location:</span>
          <span className="value">{intruderInfo.location}</span>
        </div>
        <div className="breach-row">
          <span className="label">Threat Types:</span>
          <div className="value threat-types">
            {intruderInfo.types.map((type, index) => (
              <span key={index} className={`threat-badge ${type.level}`}>
                {type.type === 'TCPIP' ? 'TCP/IP' : type.type}
                <small>({type.level})</small>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreachDetection;