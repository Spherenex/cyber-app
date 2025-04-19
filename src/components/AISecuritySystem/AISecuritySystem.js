import React, { useState, useEffect } from 'react';
import './AISecuritySystem.css';
import { Player } from '@lottiefiles/react-lottie-player';

const AISecuritySystem = ({ threatData, isActive, onThreatAnalyzed }) => {
  const [threatDetected, setThreatDetected] = useState(false);
  const [threatDetails, setThreatDetails] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    if (isActive && threatData) {
      // Start analyzing
      setIsAnalyzing(true);
      
      // Simulate AI analyzing the threat
      const analyzeTimeout = setTimeout(() => {
        setIsAnalyzing(false);
        setThreatDetected(true);
        setThreatDetails(threatData);
        
        // Notify the parent component
        onThreatAnalyzed(threatData);
      }, 3000);
      
      return () => clearTimeout(analyzeTimeout);
    }
  }, [isActive, threatData, onThreatAnalyzed]);
  
  return (
    <div className={`ai-security-system ${isActive ? 'active' : 'inactive'}`}>
      <div className="ai-header">
        <div className="ai-title">
          <h2>AI Security System</h2>
          <span className="subtitle">Real-time threat analysis and prevention</span>
        </div>
        <div className="ai-status-badge">
          {isActive ? (
            <div className="status-active">
              <span className="status-dot"></span>
              Active
            </div>
          ) : (
            <div className="status-standby">
              <span className="status-dot"></span>
              Standby
            </div>
          )}
        </div>
      </div>
      
      <div className="ai-visualization">
        <Player
          autoplay={isActive}
          loop
          src={
            isAnalyzing 
              ? "https://assets2.lottiefiles.com/packages/lf20_vvbgxgg3.json" // Analyzing animation
              : threatDetected 
                ? "https://assets9.lottiefiles.com/packages/lf20_rmlsynjm.json" // Alert animation
                : "https://assets7.lottiefiles.com/packages/lf20_qp1q7mct.json" // Idle animation
          }
          style={{ height: '240px', width: '100%' }}
        />
      </div>
      
      <div className="ai-status-panel">
        <div className="status-row">
          <span className="status-label">System Status:</span>
          <span className="status-value">
            {isActive 
              ? isAnalyzing 
                ? "Analyzing Threat..." 
                : threatDetected 
                  ? "Threat Detected!" 
                  : "Monitoring Network"
              : "Standby Mode"}
          </span>
        </div>
        
        <div className="status-row">
          <span className="status-label">Protection Level:</span>
          <span className="status-value">
            {isActive ? "Maximum" : "Passive"}
          </span>
        </div>
        
        <div className="status-row">
          <span className="status-label">Last Scan:</span>
          <span className="status-value">
            {isActive ? new Date().toLocaleTimeString() : "N/A"}
          </span>
        </div>
      </div>
      
      {threatDetected && threatDetails && (
        <div className="threat-details-panel">
          <h3>
            <i className="fas fa-exclamation-triangle"></i>
            Threat Detected
          </h3>
          <div className="threat-info">
            <div className="info-row">
              <span className="info-label">IP Address:</span>
              <span className="info-value">{threatDetails.ip}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Threat Types:</span>
              <div className="info-value threat-types">
                {threatDetails.types.map((type, index) => (
                  <span key={index} className={`threat-badge ${type.level}`}>
                    {type.type === 'TCPIP' ? 'TCP/IP' : type.type}
                    <small>({type.level})</small>
                  </span>
                ))}
              </div>
            </div>
            <div className="info-row">
              <span className="info-label">Detected:</span>
              <span className="info-value">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISecuritySystem;