import React, { useState, useEffect } from 'react';
import './FirewallSystem.css';

const Firewall = ({ level, onBreached, active }) => {
  const [securityCode, setSecurityCode] = useState('');
  const [isBreaching, setIsBreaching] = useState(false);
  const [breachProgress, setBreachProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Secure');
  const [byteCode, setByteCode] = useState('');

  // Generate byte code based on level complexity
  useEffect(() => {
    let complexity = '';
    switch(level) {
      case 1:
        complexity = generateSimpleByteCode();
        break;
      case 2:
        complexity = generateMediumByteCode();
        break;
      case 3:
        complexity = generateHardByteCode();
        break;
      case 4:
        complexity = generateExtremeByteCode();
        break;
      default:
        complexity = generateSimpleByteCode();
    }
    setByteCode(complexity);
  }, [level]);

  const generateSimpleByteCode = () => {
    return '0x7F2E1A4B';
  };

  const generateMediumByteCode = () => {
    return '0xF72A91B4E35D8C0';
  };

  const generateHardByteCode = () => {
    return '0xA2F7C1D9B38E456A7D2C1F9E8';
  };

  const generateExtremeByteCode = () => {
    return '0xF7E239C1A5B6D8F2E4A9C1B5D8F3E0A4C2B7D9';
  };

  const handleAttemptBreach = () => {
    if (!active) return;
    
    if (securityCode === byteCode) {
      setIsBreaching(true);
      setStatusMessage('Breaching in progress...');
      
      const breachInterval = setInterval(() => {
        setBreachProgress(prev => {
          if (prev >= 100) {
            clearInterval(breachInterval);
            setStatusMessage('BREACH SUCCESSFUL');
            onBreached(level);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    } else {
      setStatusMessage('Invalid breach attempt. Security protocol enhanced.');
      setTimeout(() => setStatusMessage('Secure'), 3000);
    }
  };

  return (
    <div className={`firewall-container ${active ? 'active' : 'inactive'}`}>
      <div className="firewall-header">
        <h3>Firewall Level {level}</h3>
        <div className={`status-indicator ${statusMessage === 'Secure' ? 'secure' : statusMessage === 'BREACH SUCCESSFUL' ? 'breached' : 'warning'}`}>
          {statusMessage}
        </div>
      </div>
      
      <div className="firewall-content">
        <div className="byte-code-display">
          <span>Security Protocol:</span>
          <code>{byteCode}</code>
        </div>
        
        {isBreaching ? (
          <div className="breach-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${breachProgress}%` }}
              ></div>
            </div>
            <span>{breachProgress}% Complete</span>
          </div>
        ) : (
          <div className="breach-attempt">
            <input
              type="text"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
              placeholder="Enter security code to breach"
              disabled={!active}
            />
            <button 
              onClick={handleAttemptBreach}
              disabled={!active}
              className="breach-button"
            >
              Breach Firewall
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Firewall;