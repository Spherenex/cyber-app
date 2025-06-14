
// import React, { useState, useEffect } from 'react';
// import './FirewallSystem.css';
// import AIOptimizationPopup from './AIOptimizationPopup';
// import { generateDeviceInfo, generateTimestamp } from '../../utils/firewall-utils';

// const FirewallSystem = ({ threatData, active, onAllFirewallsBreached }) => {
//   const [firewalls, setFirewalls] = useState([
//     { id: 1, name: 'Perimeter Firewall', progress: 0, breached: false, status: 'Secure', startTime: null, breachTime: null },
//     { id: 2, name: 'Network Firewall', progress: 0, breached: false, status: 'Secure', startTime: null, breachTime: null },
//     { id: 3, name: 'Application Firewall', progress: 0, breached: false, status: 'Secure', startTime: null, breachTime: null },
//     { id: 4, name: 'Data Firewall', progress: 0, breached: false, status: 'Secure', startTime: null, breachTime: null }
//   ]);
  
//   const [currentFirewallIndex, setCurrentFirewallIndex] = useState(0);
//   const [showOptimization, setShowOptimization] = useState(false);
//   const [threatInfo, setThreatInfo] = useState(null);
//   const [hasLowPriorityThreat, setHasLowPriorityThreat] = useState(false);
//   const [breachStartTime, setBreachStartTime] = useState(null);
  
//   // Set breach start time when attack begins
//   useEffect(() => {
//     if (active && threatData && !breachStartTime) {
//       setBreachStartTime(Date.now());
      
//       // Set start time for first firewall
//       setFirewalls(prev => {
//         const newFirewalls = [...prev];
//         newFirewalls[0] = {
//           ...newFirewalls[0],
//           startTime: Date.now()
//         };
//         return newFirewalls;
//       });
//     }
//   }, [active, threatData, breachStartTime]);
  
//   // Check if there are any low priority threats
//   useEffect(() => {
//     if (threatData && threatData.types) {
//       const hasLow = threatData.types.some(threat => threat.level === 'Advisory');
//       setHasLowPriorityThreat(hasLow);
//     }
//   }, [threatData]);
  
//   // Calculate strength of the attack based on threat levels
//   const calculateAttackStrength = () => {
//     if (!threatData || !threatData.types) return 0;
    
//     const levelScores = {
//       'Advisory': 1,
//       'Warning': 2.5,  // Increased weight for Warning level
//       'critical': 4    // Increased weight for Critical level
//     };
    
//     let totalScore = 0;
//     let totalTypes = threatData.types.length;
    
//     // Count types by level
//     const levelCounts = {
//       'Advisory': 0,
//       'Warning': 0,
//       'critical': 0
//     };
    
//     threatData.types.forEach(threatType => {
//       levelCounts[threatType.level] = (levelCounts[threatType.level] || 0) + 1;
//       totalScore += levelScores[threatType.level] || 0;
//     });
    
//     // If all threats are Advisory, reduce attack strength dramatically
//     if (levelCounts['Advisory'] === totalTypes && totalTypes > 0) {
//       return 0.05; // Much slower attack for all Advisory threats
//     }
    
//     // If majority are Warning, increase attack strength moderately
//     if (levelCounts['Warning'] > totalTypes / 2 && totalTypes > 0) {
//       return 0.7; // Moderate attack speed for majority Warning threats
//     }
    
//     // Default calculation for mixed or Critical-heavy threats
//     return totalTypes > 0 ? (totalScore / (totalTypes * 4)) : 0;
//   };
  
//   // Handle firewall breach progression
//   useEffect(() => {
//     if (!active || !threatData) return;
    
//     const attackStrength = calculateAttackStrength();
    
//     // Start attacking first firewall
//     const interval = setInterval(() => {
//       setFirewalls(prev => {
//         // Get current firewall being attacked
//         const currentIdx = currentFirewallIndex;
//         if (currentIdx >= prev.length) {
//           clearInterval(interval);
//           return prev;
//         }
        
//         const newFirewalls = [...prev];
        
//         // Apply firewall-specific resistance (Data Firewall takes longer)
//         let firewallResistance = 1;
//         if (currentIdx === 3) { // Data Firewall
//           firewallResistance = 3; // Takes three times as long to breach
//         } else if (currentIdx === 2) { // Application Firewall
//           firewallResistance = 1.5; // Takes 50% longer than basic firewalls
//         }
        
//         // Calculate increment amount based on attack strength and firewall resistance
//         // For all Advisory threats, make progress extremely slow
//         const allAdvisory = threatData.types && 
//                             threatData.types.every(t => t.level === 'Advisory') && 
//                             threatData.types.length > 0;
                            
//         const incrementAmount = allAdvisory ? 
//           0.2 / firewallResistance : // Very small increment for all Advisory threats
//           Math.max(0.3, (1 + Math.floor(attackStrength * 3)) / firewallResistance);
        
//         // Set start time if not set yet
//         if (newFirewalls[currentIdx].startTime === null) {
//           newFirewalls[currentIdx] = {
//             ...newFirewalls[currentIdx],
//             startTime: Date.now()
//           };
//         }
        
//         // Increment progress for current firewall
//         newFirewalls[currentIdx] = {
//           ...newFirewalls[currentIdx],
//           progress: Math.min(100, newFirewalls[currentIdx].progress + incrementAmount),
//           status: 'Under Attack'
//         };
        
//         // Check if current firewall is breached
//         if (newFirewalls[currentIdx].progress >= 100 && !newFirewalls[currentIdx].breached) {
//           // Record breach time
//           const breachDuration = Math.round((Date.now() - newFirewalls[currentIdx].startTime) / 1000); // in seconds
          
//           newFirewalls[currentIdx] = {
//             ...newFirewalls[currentIdx],
//             breached: true,
//             status: 'BREACHED',
//             breachTime: breachDuration
//           };
          
//           // Special case for second firewall - show optimization popup only if has low priority threat
//           if (currentIdx === 1) {
//             if (hasLowPriorityThreat) {
//               clearInterval(interval);
//               newFirewalls[currentIdx].status = '1st firewall breached but hacking not completed';
//               setShowOptimization(true);
//             } else {
//               // Move to next firewall if no low priority threats
//               setCurrentFirewallIndex(currentIdx + 1);
//             }
//           } 
//           // Move to next firewall
//           else if (currentIdx < prev.length - 1) {
//             setCurrentFirewallIndex(currentIdx + 1);
//           } 
//           // All firewalls breached
//           else if (currentIdx === prev.length - 1) {
//             clearInterval(interval);
            
//             // Calculate breach times for all firewalls
//             const firewallBreachTimes = newFirewalls.map(fw => ({
//               name: fw.name,
//               timeToBreak: fw.breachTime || 0
//             }));
            
//             // Generate threat information
//             const fullThreatInfo = {
//               ip: threatData.ip,
//               location: getRandomLocation(),
//               deviceInfo: generateDeviceInfo(),
//               timeStamp: generateTimestamp(),
//               types: threatData.types,
//               firewallBreachTimes: firewallBreachTimes,
//               totalBreachTime: Math.round((Date.now() - breachStartTime) / 1000)
//             };
            
//             setThreatInfo(fullThreatInfo);
            
//             // Report breach to parent component
//             if (onAllFirewallsBreached) {
//               onAllFirewallsBreached(fullThreatInfo);
//             }
//           }
//         }
        
//         return newFirewalls;
//       });
//     }, 100);
    
//     return () => clearInterval(interval);
//   }, [active, threatData, currentFirewallIndex, onAllFirewallsBreached, hasLowPriorityThreat, breachStartTime]);
  
//   // Handle optimization completion
//   const handleOptimizationComplete = () => {
//     setShowOptimization(false);
    
//     // Continue attacking remaining firewalls with increased speed
//     setCurrentFirewallIndex(prev => prev + 1);
    
//     // Update all remaining firewalls as breached after a delay
//     setTimeout(() => {
//       setFirewalls(prev => {
//         const newFirewalls = [...prev];
//         const now = Date.now();
        
//         // Simulate breach times for remaining firewalls with exact times for the chart
//         for (let i = 2; i < newFirewalls.length; i++) {
//           // If firewall not breached yet, set breach time
//           if (!newFirewalls[i].breached) {
//             // For Data Firewall, take longer even in auto-breach
//             const simulatedTime = i === 3 ? 35 : 15;
            
//             newFirewalls[i] = {
//               ...newFirewalls[i],
//               progress: 100,
//               breached: true,
//               status: 'BREACHED',
//               startTime: now - simulatedTime * 1000, // Backdate start time
//               breachTime: simulatedTime
//             };
//           }
//         }
//         return newFirewalls;
//       });
      
//       // Generate threat information
//       const totalBreachTime = Math.round((Date.now() - breachStartTime) / 1000);
      
//       // Calculate breach times for all firewalls
//       const firewallBreachTimes = firewalls.map(fw => ({
//         name: fw.name,
//         timeToBreak: fw.breachTime || 0
//       }));
      
//       const fullThreatInfo = {
//         ip: threatData.ip,
//         location: getRandomLocation(),
//         deviceInfo: generateDeviceInfo(),
//         timeStamp: generateTimestamp(),
//         types: threatData.types,
//         firewallBreachTimes: firewallBreachTimes,
//         totalBreachTime: totalBreachTime
//       };
      
//       setThreatInfo(fullThreatInfo);
      
//       // Report breach to parent component
//       if (onAllFirewallsBreached) {
//         onAllFirewallsBreached(fullThreatInfo);
//       }
//     }, 2000);
//   };
  
//   // Helper function to get a random location
//   const getRandomLocation = () => {
//     const locations = [
//       'New York, USA',
//       'Beijing, China',
//       'Moscow, Russia',
//       'London, UK',
//       'Sydney, Australia',
//       'Tokyo, Japan',
//       'Berlin, Germany',
//       'Rio de Janeiro, Brazil'
//     ];
//     return locations[Math.floor(Math.random() * locations.length)];
//   };
  
//   return (
//     <div className={`firewall-system ${active ? 'active' : 'inactive'}`}>
//       <div className="system-header">
//         <h2>Firewall Defense System</h2>
//         <div className={`system-status ${
//           firewalls.every(fw => !fw.breached) ? 'secure' :
//           firewalls.every(fw => fw.breached) ? 'compromised' : 'warning'
//         }`}>
//           {firewalls.every(fw => !fw.breached) ? 'Fully Protected' :
//            firewalls.every(fw => fw.breached) ? 'SYSTEM COMPROMISED' : 'Partial Breach'}
//         </div>
//       </div>
      
//       <div className="firewalls-container">
//         {firewalls.map((firewall) => (
//           <div 
//             key={firewall.id} 
//             className={`firewall-unit ${
//               firewall.breached ? 'breached' : 
//               firewall.progress > 0 ? 'under-attack' : ''
//             }`}
//           >
//             <div className="firewall-header">
//               <h3>{firewall.name}</h3>
//               <div className={`status-indicator ${
//                 firewall.breached ? 'breached' : 
//                 firewall.progress > 0 ? 'warning' : 'secure'
//               }`}>
//                 {firewall.status}
//               </div>
//             </div>
            
//             <div className="progress-container">
//               <div className="progress-bar">
//                 <div 
//                   className="progress-fill" 
//                   style={{ width: `${firewall.progress}%` }}
//                 ></div>
//               </div>
//               <div className="progress-text">
//                 {firewall.breached ? 
//                   `Breach Completed` : 
//                   `${Math.round(firewall.progress)}% Compromised`}
//             </div>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {threatInfo && firewalls.every(fw => fw.breached) && (
//         <div className="breach-summary">
//           <h3><i className="fas fa-exclamation-triangle"></i> Security Breach Detected</h3>
//           <div className="breach-details">
//             <div className="detail-row">
//               <span className="detail-label">Source IP:</span>
//               <span className="detail-value">{threatInfo.ip}</span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Location:</span>
//               <span className="detail-value">{threatInfo.location}</span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Device:</span>
//               <span className="detail-value">{threatInfo.deviceInfo}</span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Timestamp:</span>
//               <span className="detail-value">{threatInfo.timeStamp}</span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Total Breach Time:</span>
//               <span className="detail-value">{threatInfo.totalBreachTime} seconds</span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Threat Types:</span>
//               <div className="detail-value threat-types">
//                 {threatInfo.types.map((type, index) => (
//                   <span key={index} className={`threat-badge ${type.level}`}>
//                     {type.type === 'TCPIP' ? 'TCP/IP' : type.type}
//                     <small>({type.level})</small>
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {showOptimization && (
//         <AIOptimizationPopup onComplete={handleOptimizationComplete} />
//       )}
//     </div>
//   );
// };

// export default FirewallSystem;





import React, { useState, useEffect } from 'react';
import './FirewallSystem.css';
import AIOptimizationPopup from './AIOptimizationPopup';
import { generateDeviceInfo, generateTimestamp } from '../../utils/firewall-utils';

const FirewallSystem = ({ threatData, active, onAllFirewallsBreached }) => {
  const [firewalls, setFirewalls] = useState([
    { id: 1, name: 'Perimeter Firewall', progress: 0, breached: false, status: 'Secure', startTime: null, breachTime: null },
    { id: 2, name: 'Network Firewall', progress: 0, breached: false, status: 'Secure', startTime: null, breachTime: null },
    { id: 3, name: 'Application Firewall', progress: 0, breached: false, status: 'Secure', startTime: null, breachTime: null },
    { id: 4, name: 'Data Firewall', progress: 0, breached: false, status: 'Secure', startTime: null, breachTime: null }
  ]);
  
  const [currentFirewallIndex, setCurrentFirewallIndex] = useState(0);
  const [showOptimization, setShowOptimization] = useState(false);
  const [threatInfo, setThreatInfo] = useState(null);
  const [breachStartTime, setBreachStartTime] = useState(null);
  const [optimizationCompleted, setOptimizationCompleted] = useState(false);
  const [postOptimizationPhase, setPostOptimizationPhase] = useState(false);
  
  // Helper function to check if all threats are of a specific level
  const areAllThreatsOfLevel = (level) => {
    return threatData && 
           threatData.types && 
           threatData.types.length > 0 && 
           threatData.types.every(t => t.level === level);
  };
  
  // Reset the system when new threat data is received
  useEffect(() => {
    if (threatData) {
      // Reset state when new threat data comes in
      setFirewalls([
        { id: 1, name: 'Perimeter Firewall', progress: 0, breached: false, status: 'Secure', startTime: null, breachTime: null },
        { id: 2, name: 'Network Firewall', progress: 0, breached: false, status: 'Secure', startTime: null, breachTime: null },
        { id: 3, name: 'Application Firewall', progress: 0, breached: false, status: 'Secure', startTime: null, breachTime: null },
        { id: 4, name: 'Data Firewall', progress: 0, breached: false, status: 'Secure', startTime: null, breachTime: null }
      ]);
      setCurrentFirewallIndex(0);
      setBreachStartTime(null);
      setOptimizationCompleted(false);
      setPostOptimizationPhase(false);
      setShowOptimization(false);
      setThreatInfo(null);
    }
  }, [threatData]);
  
  // Set breach start time when attack begins
  useEffect(() => {
    if (active && threatData && !breachStartTime) {
      setBreachStartTime(Date.now());
      
      // Set start time for first firewall
      setFirewalls(prev => {
        const newFirewalls = [...prev];
        newFirewalls[0] = {
          ...newFirewalls[0],
          startTime: Date.now()
        };
        return newFirewalls;
      });
    }
  }, [active, threatData, breachStartTime]);
  
  // Calculate strength of the attack based on threat levels
  const calculateAttackStrength = () => {
    if (!threatData || !threatData.types) return 0;
    
    // If we're in post-optimization phase, control speeds differently
    if (postOptimizationPhase) {
      // For 3rd firewall (index 2), use moderate speed
      if (currentFirewallIndex === 2) {
        return 0.4; // Moderate speed for 3rd firewall after optimization
      }
      // For 4th firewall (index 3), use minimum speed
      else if (currentFirewallIndex === 3) {
        return 0.1; // Minimum speed for last firewall after optimization
      }
    }
    
    // If all threats are Advisory, use very slow speed
    if (areAllThreatsOfLevel('Advisory')) {
      return 0.05; // Extremely slow for all Advisory threats
    }
    
    // If all threats are critical, use maximum speed
    if (areAllThreatsOfLevel('critical')) {
      return 1.0; // Maximum speed for all critical threats
    }
    
    // For mixed threat levels, calculate based on composition
    const levelScores = {
      'Advisory': 1,
      'Warning': 2.5,
      'critical': 4
    };
    
    let totalScore = 0;
    let totalTypes = threatData.types.length;
    
    threatData.types.forEach(threatType => {
      totalScore += levelScores[threatType.level] || 0;
    });
    
    // Default calculation for mixed threats
    return totalTypes > 0 ? (totalScore / (totalTypes * 4)) * 0.7 : 0;
  };
  
  // Handle firewall breach progression
  useEffect(() => {
    // Only proceed if active, threatData exists, and we're not waiting for user to return from optimization
    if (!active || !threatData || showOptimization) return;
    
    const attackStrength = calculateAttackStrength();
    
    // Start attacking firewalls
    const interval = setInterval(() => {
      setFirewalls(prev => {
        // Get current firewall being attacked
        const currentIdx = currentFirewallIndex;
        if (currentIdx >= prev.length) {
          clearInterval(interval);
          return prev;
        }
        
        const newFirewalls = [...prev];
        
        // Apply firewall-specific resistance
        let firewallResistance = 1;
        if (currentIdx === 3) { // Data Firewall
          firewallResistance = 3; // Takes three times as long to breach
        } else if (currentIdx === 2) { // Application Firewall
          firewallResistance = 1.5; // Takes 50% longer than basic firewalls
        }
        
        // Calculate increment amount
        const incrementAmount = Math.max(0.2, (attackStrength * 2) / firewallResistance);
        
        // Set start time if not set yet
        if (newFirewalls[currentIdx].startTime === null) {
          newFirewalls[currentIdx] = {
            ...newFirewalls[currentIdx],
            startTime: Date.now()
          };
        }
        
        // Increment progress for current firewall
        newFirewalls[currentIdx] = {
          ...newFirewalls[currentIdx],
          progress: Math.min(100, newFirewalls[currentIdx].progress + incrementAmount),
          status: 'Under Attack'
        };
        
        // Check if current firewall is breached
        if (newFirewalls[currentIdx].progress >= 100 && !newFirewalls[currentIdx].breached) {
          // Record breach time
          const breachDuration = Math.round((Date.now() - newFirewalls[currentIdx].startTime) / 1000);
          
          newFirewalls[currentIdx] = {
            ...newFirewalls[currentIdx],
            breached: true,
            status: 'BREACHED',
            breachTime: breachDuration
          };
          
          // Check for showing AI optimization
          if (currentIdx === 1) { // After second firewall breach
            // Show optimization UNLESS all threats are critical
            if (!areAllThreatsOfLevel('critical')) {
              clearInterval(interval);
              newFirewalls[currentIdx].status = 'Firewall breached';
              setShowOptimization(true);
            } else {
              // Only move to next firewall if all are critical
              setCurrentFirewallIndex(currentIdx + 1);
            }
          } 
          // Move to next firewall
          else if (currentIdx < prev.length - 1) {
            setCurrentFirewallIndex(currentIdx + 1);
          } 
          // All firewalls breached
          else if (currentIdx === prev.length - 1) {
            clearInterval(interval);
            
            // Calculate breach times for all firewalls
            const firewallBreachTimes = newFirewalls.map(fw => ({
              name: fw.name,
              timeToBreak: fw.breachTime || 0
            }));
            
            // Generate threat information
            const fullThreatInfo = {
              ip: threatData.ip,
              location: getRandomLocation(),
              deviceInfo: generateDeviceInfo(),
              timeStamp: generateTimestamp(),
              types: threatData.types,
              firewallBreachTimes: firewallBreachTimes,
              totalBreachTime: Math.round((Date.now() - breachStartTime) / 1000)
            };
            
            setThreatInfo(fullThreatInfo);
            
            // Report breach to parent component
            if (onAllFirewallsBreached) {
              onAllFirewallsBreached(fullThreatInfo);
            }
          }
        }
        
        return newFirewalls;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [active, threatData, currentFirewallIndex, onAllFirewallsBreached, breachStartTime, showOptimization, postOptimizationPhase]);
  
  // Handle optimization completion
  const handleOptimizationComplete = () => {
    setShowOptimization(false);
    setOptimizationCompleted(true);
    setPostOptimizationPhase(true);
    
    // Continue attacking the 3rd firewall
    setCurrentFirewallIndex(2);
  };
  
  // Helper function to get a random location
  const getRandomLocation = () => {
    const locations = [
      'New York, USA',
      'Beijing, China',
      'Moscow, Russia',
      'London, UK',
      'Sydney, Australia',
      'Tokyo, Japan',
      'Berlin, Germany',
      'Rio de Janeiro, Brazil'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };
  
  return (
    <div className={`firewall-system ${active ? 'active' : 'inactive'}`}>
      <div className="system-header">
        <h2>Firewall Defense System</h2>
        <div className={`system-status ${
          firewalls.every(fw => !fw.breached) ? 'secure' :
          firewalls.every(fw => fw.breached) ? 'compromised' : 'warning'
        }`}>
          {firewalls.every(fw => !fw.breached) ? 'Fully Protected' :
           firewalls.every(fw => fw.breached) ? 'SYSTEM COMPROMISED' : 'Partial Breach'}
        </div>
      </div>
      
      <div className="firewalls-container">
        {firewalls.map((firewall) => (
          <div 
            key={firewall.id} 
            className={`firewall-unit ${
              firewall.breached ? 'breached' : 
              firewall.progress > 0 ? 'under-attack' : ''
            }`}
          >
            <div className="firewall-header">
              <h3>{firewall.name}</h3>
              <div className={`status-indicator ${
                firewall.breached ? 'breached' : 
                firewall.progress > 0 ? 'warning' : 'secure'
              }`}>
                {firewall.status}
              </div>
            </div>
            
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${firewall.progress}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {firewall.breached ? 
                  `Breach Completed` : 
                  `${Math.round(firewall.progress)}% Compromised`}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {threatInfo && firewalls.every(fw => fw.breached) && (
        <div className="breach-summary">
          <h3><i className="fas fa-exclamation-triangle"></i> Security Breach Detected</h3>
          <div className="breach-details">
            <div className="detail-row">
              <span className="detail-label">Source IP:</span>
              <span className="detail-value">{threatInfo.ip}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{threatInfo.location}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Device:</span>
              <span className="detail-value">{threatInfo.deviceInfo}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Timestamp:</span>
              <span className="detail-value">{threatInfo.timeStamp}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Breach Time:</span>
              <span className="detail-value">{threatInfo.totalBreachTime} seconds</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Threat Types:</span>
              <div className="detail-value threat-types">
                {threatInfo.types.map((type, index) => (
                  <span key={index} className={`threat-badge ${type.level}`}>
                    {type.type === 'TCPIP' ? 'TCP/IP' : type.type}
                    <small>({type.level})</small>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showOptimization && (
        <AIOptimizationPopup onComplete={handleOptimizationComplete} />
      )}
    </div>
  );
};

export default FirewallSystem;