
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import ThreatGenerator from '../ThreatGenerator/ThreatGenerator';
import AISecuritySystem from '../AISecuritySystem/AISecuritySystem';
import FirewallSystem from '../FirewallSystem/FirewallSystem';
import BreachDetection from '../BreachDetection/BreachDetection';
import AIOptimizationAnalysis from '../AIOptimizationAnalysis/AIOptimizationAnalysis';

const Dashboard = ({ username }) => {
  const [threatData, setThreatData] = useState(null);
  const [aiActive, setAiActive] = useState(false);
  const [firewallActive, setFirewallActive] = useState(false);
  const [threatAnalyzed, setThreatAnalyzed] = useState(false);
  const [breachDetected, setBreachDetected] = useState(false);
  const [intruderInfo, setIntruderInfo] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [threatHistory, setThreatHistory] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // Handle when a threat is generated from the ThreatGenerator
  const handleThreatGenerated = (data) => {
    setThreatData(data);
    
    // Show alert message
    setAlertMessage({
      type: 'warning',
      message: `Alert: Threat detected from IP ${data.ip}. AI Security System activated.`
    });
    
    // Activate the AI Security System
    setAiActive(true);
    
    // Clear the alert after a few seconds
    setTimeout(() => setAlertMessage(null), 4000);
  };
  
  // Handle when the AI analyzes the threat
  const handleThreatAnalyzed = (data) => {
    setThreatAnalyzed(true);
    
    // Show alert message
    setAlertMessage({
      type: 'warning',
      message: `AI Security System: Threat from IP ${data.ip} analyzed. Engaging firewall defenses.`
    });
    
    // Activate the Firewall System
    setFirewallActive(true);
    
    // Clear the alert after a few seconds
    setTimeout(() => setAlertMessage(null), 4000);
  };
  
  // Handle when all firewalls are breached
  const handleAllFirewallsBreached = (info) => {
    setBreachDetected(true);
    setIntruderInfo(info);
    
    // Add to threat history
    const newThreat = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      info: info,
      recoveryTime: Math.floor(Math.random() * 600) + 300, // Random recovery time between 300-900 seconds
      firewallsBreached: 4
    };
    
    setThreatHistory(prevHistory => [...prevHistory, newThreat]);
    
    // Show critical alert message
    setAlertMessage({
      type: 'critical',
      message: 'CRITICAL ALERT: All firewalls breached! System compromised!'
    });
    
    // Clear the alert after a few seconds
    setTimeout(() => setAlertMessage(null), 5000);
  };
  
  const toggleAnalysis = () => {
    setShowAnalysis(prev => !prev);
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="logo-area">
          <h1>CyberShield</h1>
          <span className="subtitle">Advanced Security System</span>
        </div>
        <div className="user-info">
          <span className="welcome-text">Welcome, {username}</span>
          <span className="status-text">
            System Status: {breachDetected ? 'COMPROMISED' : 'Protected'}
          </span>
        </div>
      </div>
      
      {alertMessage && (
        <div className={`alert-message ${alertMessage.type}`}>
          {alertMessage.message}
        </div>
      )}
      
      <div className="dashboard-content">
        {showAnalysis ? (
          <AIOptimizationAnalysis 
            threatData={threatData} 
            intruderInfo={intruderInfo}
            threatHistory={threatHistory}
            onClose={toggleAnalysis}
          />
        ) : (
          <>
            <div className="dashboard-column">
              {/* Threat Generator Section */}
              <ThreatGenerator onThreatGenerated={handleThreatGenerated} />
              
              {/* AI Security System Section */}
              <AISecuritySystem 
                threatData={threatData} 
                isActive={aiActive}
                onThreatAnalyzed={handleThreatAnalyzed}
              />
            </div>
            
            <div className="dashboard-column">
              {/* Firewall System */}
              <FirewallSystem 
                threatData={threatData}
                active={firewallActive && threatAnalyzed}
                onAllFirewallsBreached={handleAllFirewallsBreached}
              />
              
              {/* AI Optimization Analysis Button */}
              {breachDetected && intruderInfo && (
                <div className="analysis-button-container">
                  <button className="ai-analysis-button" onClick={toggleAnalysis}>
                    <i className="fas fa-chart-line"></i> AI Optimization Analysis
                  </button>
                </div>
              )}
              
              {/* Breach Detection */}
              {/* {breachDetected && intruderInfo && (
                <BreachDetection intruderInfo={intruderInfo} />
              )} */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;