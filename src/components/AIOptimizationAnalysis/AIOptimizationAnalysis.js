// import React, { useState, useEffect } from 'react';
// import './AIOptimizationAnalysis.css';
// import { Player } from '@lottiefiles/react-lottie-player';
// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const AIOptimizationAnalysis = ({ threatData, intruderInfo, threatHistory, onClose }) => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [recoveryData, setRecoveryData] = useState([]);
//   const [timelineData, setTimelineData] = useState([]);
//   const [threatDistribution, setThreatDistribution] = useState([]);
//   const [firewallBreachData, setFirewallBreachData] = useState([]);
//   const [recoverySteps, setRecoverySteps] = useState([]);
//   const [threatFrequencyData, setThreatFrequencyData] = useState([]);

//   // Regenerate data when tab changes
//   useEffect(() => {
//     generateRandomData();
//   }, [activeTab, threatData]);

//   // Generate all random data
//   const generateRandomData = () => {
//     setRecoveryData(generateRecoveryData());
//     setTimelineData(generateTimelineData());
//     setThreatDistribution(generateThreatDistribution());
//     setFirewallBreachData(generateFirewallBreachData());
//     setRecoverySteps(generateRecoverySteps());
//     setThreatFrequencyData(generateThreatFrequencyData());
//   };

//   // Map old level names to new level names
//   const mapThreatLevel = (level) => {
//     const levelMap = {
//       'low': 'advisory',
//       'middle': 'warning',
//       'high': 'critical'
//     };
//     return levelMap[level] || level;
//   };

//   // Calculate threat severity score
//   const calculateThreatScore = () => {
//     if (!threatData || !threatData.types) return Math.floor(Math.random() * 100);

//     const levelScores = {
//       'advisory': 1,
//       'warning': 2,
//       'critical': 3,
//       // Keep the old mappings for backward compatibility
//       'low': 1,
//       'middle': 2,
//       'high': 3
//     };

//     let totalScore = 0;
//     let totalPossible = 0;

//     threatData.types.forEach(threatType => {
//       const mappedLevel = mapThreatLevel(threatType.level);
//       totalScore += levelScores[mappedLevel] || 0;
//       totalPossible += 3; // Maximum possible score for each type
//     });

//     return totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : Math.floor(Math.random() * 100);
//   };

//   const threatScore = calculateThreatScore();

//   // Generate random system recovery data
//   function generateRecoveryData() {
//     const steps = [
//       'System Analysis',
//       'Threat Identification',
//       'Network Isolation',
//       'Data Backup Verification',
//       'Malware Removal',
//       'System Patching',
//       'Firewall Reconfiguration',
//       'Security Rule Updates',
//       'System Restoration',
//       'Integrity Verification'
//     ];

//     return steps.map((step, index) => ({
//       name: step,
//       value: Math.floor(Math.random() * 60) + 30, // Random time between 30-90 seconds
//       fill: index % 2 === 0 ? '#4ade80' : '#3b82f6'
//     }));
//   }

//   // Generate random recovery timeline data
//   function generateTimelineData() {
//     const data = [];
//     const now = new Date();
//     let baseRecovery = Math.floor(Math.random() * 30);
//     let baseActivity = 100 - Math.floor(Math.random() * 20);

//     for (let i = 0; i < 10; i++) {
//       const date = new Date(now.getTime() - (9 - i) * 5 * 60000); // 5 minute intervals going back

//       // More random progression with some variations
//       baseRecovery += Math.floor(Math.random() * 12) + 4;
//       baseActivity -= Math.floor(Math.random() * 12) + 4;

//       data.push({
//         time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         recovery: Math.min(100, baseRecovery), // 0% to 100% recovery progress
//         activity: Math.max(0, baseActivity) // 100% to 0% malicious activity
//       });
//     }

//     return data;
//   }

//   // Generate threat type distribution
//   function generateThreatDistribution() {
//     if (!threatData || !threatData.types || threatData.types.length === 0) {
//       return [
//         { name: 'WLAN', value: Math.floor(Math.random() * 30) + 5 },
//         { name: 'TCP/IP', value: Math.floor(Math.random() * 30) + 5 },
//         { name: 'HTTP', value: Math.floor(Math.random() * 30) + 5 },
//         { name: 'Firewall', value: Math.floor(Math.random() * 30) + 5 }
//       ];
//     }

//     const threatCounts = {
//       'WLAN': 0,
//       'TCPIP': 0,
//       'HTTP': 0,
//       'Firewall': 0
//     };

//     threatData.types.forEach(threat => {
//       const mappedLevel = mapThreatLevel(threat.level);
//       threatCounts[threat.type] += mappedLevel === 'advisory' ? 1 : 
//                                  mappedLevel === 'warning' ? 2 : 3;
//     });

//     // Add some randomness to the values
//     Object.keys(threatCounts).forEach(key => {
//       threatCounts[key] = Math.max(1, threatCounts[key] + Math.floor(Math.random() * 3) - 1);
//     });

//     return Object.entries(threatCounts).map(([key, value]) => ({
//       name: key === 'TCPIP' ? 'TCP/IP' : key,
//       value: value > 0 ? value : 1 // Ensure at least a small slice for visualization
//     }));
//   }

//   // Firewall breach timeline data
//   function generateFirewallBreachData() {
//     return [
//       { name: 'Perimeter Firewall', timeToBreak: Math.floor(Math.random() * 20) + 5 },
//       { name: 'Network Firewall', timeToBreak: Math.floor(Math.random() * 15) + 15 },
//       { name: 'Application Firewall', timeToBreak: Math.floor(Math.random() * 10) + 25 },
//       { name: 'Data Firewall', timeToBreak: Math.floor(Math.random() * 5) + 30 }
//     ];
//   }

//   function generateRecoverySteps() {
//     const completedSteps = Math.floor(Math.random() * 3) + 2; // 2-4 completed steps
//     const inProgressSteps = Math.floor(Math.random() * 2) + 1; // 1-2 in progress steps

//     const allSteps = [
//       { name: 'Network Isolation', status: 'pending', progress: 0 },
//       { name: 'Threat Identification', status: 'pending', progress: 0 },
//       { name: 'System Backup', status: 'pending', progress: 0 },
//       { name: 'Malware Removal', status: 'pending', progress: 0 },
//       { name: 'Security Patching', status: 'pending', progress: 0 },
//       { name: 'Firewall Reconfiguration', status: 'pending', progress: 0 },
//       { name: 'Integrity Verification', status: 'pending', progress: 0 },
//       { name: 'System Restoration', status: 'pending', progress: 0 }
//     ];

//     // Set completed steps
//     for (let i = 0; i < completedSteps; i++) {
//       if (i < allSteps.length) {
//         allSteps[i].status = 'complete';
//         allSteps[i].progress = 100;
//       }
//     }

//     // Set in-progress steps
//     for (let i = completedSteps; i < completedSteps + inProgressSteps; i++) {
//       if (i < allSteps.length) {
//         allSteps[i].status = 'in-progress';
//         allSteps[i].progress = Math.floor(Math.random() * 85) + 15; // 15-99% complete
//       }
//     }

//     return allSteps;
//   }

//   function generateThreatFrequencyData() {
//     const data = [];
//     const now = new Date();

//     for (let i = 6; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(now.getDate() - i);

//       data.push({
//         date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
//         threats: Math.floor(Math.random() * 5)
//       });
//     }

//     return data;
//   }

//   // Colors for pie chart
//   const COLORS = ['#4ade80', '#3b82f6', '#f59e0b', '#ef4444'];

//   // Format seconds to mm:ss
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? '0' + secs : secs}`;
//   };

//   // Calculate overall recovery percentage
//   const calculateOverallRecovery = () => {
//     if (!recoverySteps || recoverySteps.length === 0) return 0;

//     const totalProgress = recoverySteps.reduce((sum, step) => sum + step.progress, 0);
//     return Math.round(totalProgress / recoverySteps.length);
//   };

//   // Generate random recovery time
//   const getRandomRecoveryTime = () => {
//     return Math.floor(Math.random() * 400) + 200; // 200-600 seconds
//   };

//   // Get random firewall breached count
//   const getRandomFirewallBreached = () => {
//     return `${Math.floor(Math.random() * 4) + 1}/4`;
//   };

//   // Get CSS class for threat level
//   const getThreatLevelClass = (level) => {
//     const mappedLevel = mapThreatLevel(level);
//     return mappedLevel; // Use the mapped level as CSS class
//   };

//   // Get threat level display name
//   const getThreatLevelDisplayName = (level) => {
//     const mappedLevel = mapThreatLevel(level);
//     return mappedLevel.charAt(0).toUpperCase() + mappedLevel.slice(1);
//   };

//   return (
//     <div className="ai-optimization-analysis">
//       <div className="analysis-header">
//         <h2>AI Optimization Analysis</h2>
//         <button className="close-button" onClick={onClose}>
//           <i className="fas fa-times"></i>
//         </button>
//       </div>

//       <div className="tabs">
//         <button 
//           className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
//           onClick={() => setActiveTab('overview')}
//         >
//           <i className="fas fa-tachometer-alt"></i> Overview
//         </button>
//         <button 
//           className={`tab-button ${activeTab === 'threats' ? 'active' : ''}`}
//           onClick={() => setActiveTab('threats')}
//         >
//           <i className="fas fa-bug"></i> Threat Analysis
//         </button>
//         <button 
//           className={`tab-button ${activeTab === 'recovery' ? 'active' : ''}`}
//           onClick={() => setActiveTab('recovery')}
//         >
//           <i className="fas fa-undo"></i> Recovery Process
//         </button>
//         <button 
//           className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
//           onClick={() => setActiveTab('history')}
//         >
//           <i className="fas fa-history"></i> History
//         </button>
//       </div>

//       <div className="tab-content">
//         {activeTab === 'overview' && (
//           <>
//             <div className="overview-cards">
//               <div className="analysis-card">
//                 <div className="card-icon red">
//                   <i className="fas fa-exclamation-triangle"></i>
//                 </div>
//                 <div className="card-content">
//                   <h3>Threat Severity</h3>
//                   <div className="card-value">{threatScore}%</div>
//                   <div className="severity-bar">
//                     <div 
//                       className="severity-fill" 
//                       style={{ 
//                         width: `${threatScore}%`,
//                         backgroundColor: threatScore < 40 ? '#4ade80' : 
//                                         threatScore < 70 ? '#f59e0b' : '#ef4444'
//                       }} 
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="analysis-card">
//                 <div className="card-icon blue">
//                   <i className="fas fa-shield-alt"></i>
//                 </div>
//                 <div className="card-content">
//                   <h3>Firewalls Breached</h3>
//                   <div className="card-value">{getRandomFirewallBreached()}</div>
//                   <div className="card-subtitle">Security layers compromised</div>
//                 </div>
//               </div>

//               <div className="analysis-card">
//                 <div className="card-icon green">
//                   <i className="fas fa-clock"></i>
//                 </div>
//                 <div className="card-content">
//                   <h3>Recovery Time</h3>
//                   <div className="card-value">
//                     {formatTime(threatHistory.length > 0 ? 
//                     Math.floor(Math.random() * (threatHistory[threatHistory.length - 1].recoveryTime)) : 
//                     getRandomRecoveryTime())}
//                   </div>
//                   <div className="card-subtitle">Estimated system restoration</div>
//                 </div>
//               </div>

//               <div className="analysis-card">
//                 <div className="card-icon orange">
//                   <i className="fas fa-network-wired"></i>
//                 </div>
//                 <div className="card-content">
//                   <h3>Attack Source</h3>
//                   <div className="card-value">
//                     {intruderInfo?.ip || `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`}
//                   </div>
//                   <div className="card-subtitle">
//                     {intruderInfo?.location || ['Unknown Location', 'New York, USA', 'Beijing, China', 'Moscow, Russia', 'London, UK'][Math.floor(Math.random() * 5)]}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="analysis-charts">
//               <div className="chart-container">
//                 <h3>System Recovery Timeline</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={timelineData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="time" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Line 
//                       type="monotone" 
//                       dataKey="recovery" 
//                       stroke="#4ade80" 
//                       name="Recovery Progress (%)" 
//                       strokeWidth={2} 
//                       dot={{ r: 3 }}
//                       activeDot={{ r: 5 }}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="activity" 
//                       stroke="#ef4444" 
//                       name="Malicious Activity (%)" 
//                       strokeWidth={2}
//                       dot={{ r: 3 }}
//                       activeDot={{ r: 5 }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="chart-container">
//                 <h3>Threat Distribution</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={threatDistribution}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={100}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {threatDistribution.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </>
//         )}

//         {activeTab === 'threats' && (
//           <>
//             <div className="threat-details">
//               <div className="threat-info-panel">
//                 <h3>Threat Details</h3>
//                 {threatData && threatData.types ? (
//                   <div className="threat-types-container">
//                     {threatData.types.map((type, index) => {
//                       // Add some randomness to the description
//                       const descriptions = {
//                         'WLAN': [
//                           'Wireless network communication interception',
//                           'WiFi protocol vulnerability exploitation',
//                           'Unauthorized wireless access point detected'
//                         ],
//                         'TCPIP': [
//                           'Network protocol layer exploitation',
//                           'IP spoofing attack detected',
//                           'TCP sequence prediction attack'
//                         ],
//                         'HTTP': [
//                           'Web application vulnerability exploitation',
//                           'Cross-site scripting (XSS) attack',
//                           'SQL injection attempt detected'
//                         ],
//                         'Firewall': [
//                           'Security boundary penetration',
//                           'Firewall rule bypass detected',
//                           'Packet filter evasion attempt'
//                         ]
//                       };

//                       const descriptionArray = descriptions[type.type] || ['Unknown threat type'];
//                       const randomDesc = descriptionArray[Math.floor(Math.random() * descriptionArray.length)];
//                       const mappedLevel = mapThreatLevel(type.level);

//                       return (
//                         <div key={index} className={`threat-type-card ${mappedLevel}`}>
//                           <div className="threat-icon">
//                             <i className={`fas ${
//                               type.type === 'WLAN' ? 'fa-wifi' : 
//                               type.type === 'TCPIP' ? 'fa-network-wired' :
//                               type.type === 'HTTP' ? 'fa-globe' : 'fa-shield-alt'
//                             }`}></i>
//                           </div>
//                           <div className="threat-type-content">
//                             <h4>{type.type === 'TCPIP' ? 'TCP/IP' : type.type}</h4>
//                             <div className="threat-level">
//                               <span className="level-indicator"></span>
//                               {getThreatLevelDisplayName(type.level)} Priority
//                             </div>
//                             <div className="threat-description">{randomDesc}</div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="no-data">No threat data available</div>
//                 )}
//               </div>

//               <div className="chart-container">
//                 <h3>Firewall Breach Timeline</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={firewallBreachData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis label={{ value: 'Seconds to Breach', angle: -90, position: 'insideLeft' }} />
//                     <Tooltip formatter={(value) => [`${value} seconds`, 'Time to Breach']} />
//                     <Legend />
//                     {/* <Bar dataKey="timeToBreak" name="Time to Breach (seconds)" fill="#ef4444" /> */}
//                     <Bar 
//   dataKey="timeToBreak" 
//   name={`Breach Time (${getRecoveryTime()} seconds)`} 
//   fill="#ef4444"
//   label={{ 
//     position: 'right',
//     formatter: (value) => `${value}s`,
//     fill: '#000'
//   }}  
// />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="vulnerability-map">
//                 <h3>Attack Vector Analysis</h3>
//                 <div className="map-container">
//                   <Player
//                     autoplay
//                     loop
//                     src="https://assets10.lottiefiles.com/packages/lf20_ffkzpglj.json"
//                     style={{ height: '300px', width: '100%' }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {activeTab === 'recovery' && (
//           <>
//             <div className="recovery-status">
//               <div className="recovery-header">
//                 <h3>System Recovery Progress</h3>
//                 <div className="recovery-timer">
//                   Elapsed Time: {formatTime(threatHistory.length > 0 ? 
//                     Math.floor(Math.random() * threatHistory[threatHistory.length - 1].recoveryTime) : 
//                     Math.floor(Math.random() * 300) + 60)}
//                 </div>
//               </div>

//               <div className="progress-container">
//                 <div className="overall-progress">
//                   <div className="progress-label">Overall Recovery:</div>
//                   <div className="progress-bar-container">
//                     <div 
//                       className="progress-bar-fill" 
//                       style={{ width: `${calculateOverallRecovery()}%` }}
//                     ></div>
//                   </div>
//                   <div className="progress-percentage">{calculateOverallRecovery()}%</div>
//                 </div>

//                 <div className="recovery-steps">
//                   {recoverySteps.map((step, index) => (
//                     <div key={index} className={`recovery-step ${step.status}`}>
//                       <div className="step-status-icon">
//                         {step.status === 'complete' ? (
//                           <i className="fas fa-check-circle"></i>
//                         ) : step.status === 'in-progress' ? (
//                           <i className="fas fa-spinner fa-spin"></i>
//                         ) : (
//                           <i className="far fa-clock"></i>
//                         )}
//                       </div>
//                       <div className="step-details">
//                         <div className="step-name">{step.name}</div>
//                         <div className="step-progress-bar">
//                           <div 
//                             className="step-progress-fill"
//                             style={{ width: `${step.progress}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                       <div className="step-percentage">{step.progress}%</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="chart-container">
//                 <h3>Recovery Time by Process</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={recoveryData} layout="vertical">
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis type="number" label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }} />
//                     <YAxis dataKey="name" type="category" width={150} />
//                     <Tooltip formatter={(value) => [`${value} seconds`, 'Time']} />
//                     <Legend />
//                     <Bar dataKey="value" name="Recovery Time (seconds)" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </>
//         )}

//         {activeTab === 'history' && (
//           <>
//             <div className="history-container">
//               <h3>Threat History Log</h3>

//               {threatHistory.length > 0 ? (
//                 <div className="history-table">
//                   <div className="table-header">
//                     <div className="header-cell">Date & Time</div>
//                     <div className="header-cell">IP Address</div>
//                     <div className="header-cell">Origin</div>
//                     <div className="header-cell">Threat Level</div>
//                     <div className="header-cell">Recovery Time</div>
//                     <div className="header-cell">Status</div>
//                   </div>

//                   <div className="table-body">
//                     {[...threatHistory].reverse().map((threat, index) => {
//                       // Calculate the threat level based on types
//                       let threatLevel = 'advisory';
//                       if (threat.info && threat.info.types) {
//                         if (threat.info.types.some(t => t.level === 'high' || t.level === 'critical')) {
//                           threatLevel = 'critical';
//                         } else if (threat.info.types.some(t => t.level === 'middle' || t.level === 'warning')) {
//                           threatLevel = 'warning';
//                         }
//                       } else {
//                         threatLevel = ['advisory', 'warning', 'critical'][Math.floor(Math.random() * 3)];
//                       }

//                       return (
//                         <div key={index} className="table-row">
//                           <div className="table-cell">
//                             {new Date(threat.timestamp).toLocaleString()}
//                           </div>
//                           <div className="table-cell">
//                             {threat.info?.ip || `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`}
//                           </div>
//                           <div className="table-cell">
//                             {threat.info?.location || ['Unknown', 'New York, USA', 'Beijing, China', 'Moscow, Russia', 'London, UK'][Math.floor(Math.random() * 5)]}
//                           </div>
//                           <div className="table-cell">
//                             <span className={`threat-badge ${threatLevel}`}>
//                               {threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1)}
//                             </span>
//                           </div>
//                           <div className="table-cell">
//                             {formatTime(Math.floor(Math.random() * 300) + threat.recoveryTime / 2)}
//                           </div>
//                           <div className="table-cell">
//                             <span className="status-indicator resolved">Resolved</span>
//                           </div>
//                         </div>
//                       );
//                     })}

//                     {/* Add some fake history items for visual effect */}
//                     {threatHistory.length < 5 && (
//                       Array.from({ length: 5 - threatHistory.length }).map((_, index) => {
//                         const randomDate = new Date();
//                         randomDate.setDate(randomDate.getDate() - (index + 1));

//                         const levels = ['advisory', 'warning', 'critical'];
//                         const randomLevel = levels[Math.floor(Math.random() * levels.length)];
//                         const locations = ['New York, USA', 'Beijing, China', 'Moscow, Russia', 'London, UK', 'Toronto, Canada', 'Sydney, Australia'];

//                         return (
//                           <div key={`fake-${index}`} className="table-row">
//                             <div className="table-cell">
//                               {randomDate.toLocaleString()}
//                             </div>
//                             <div className="table-cell">
//                               {`192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`}
//                             </div>
//                             <div className="table-cell">
//                               {locations[Math.floor(Math.random() * locations.length)]}
//                             </div>
//                             <div className="table-cell">
//                               <span className={`threat-badge ${randomLevel}`}>
//                                 {randomLevel.charAt(0).toUpperCase() + randomLevel.slice(1)}
//                               </span>
//                             </div>
//                             <div className="table-cell">
//                               {formatTime(Math.floor(Math.random() * 600) + 300)}
//                             </div>
//                             <div className="table-cell">
//                               <span className="status-indicator resolved">Resolved</span>
//                             </div>
//                           </div>
//                         );
//                       })
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="no-history">
//                   <i className="fas fa-history"></i>
//                   <p>No threat history available yet.</p>
//                   <p>Past threats and their analysis will appear here.</p>
//                 </div>
//               )}

//               <div className="chart-container">
//                 <h3>Threat Frequency Analysis</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={threatFrequencyData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="date" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Line 
//                       type="monotone" 
//                       dataKey="threats" 
//                       stroke="#3b82f6" 
//                       name="Number of Threats" 
//                       strokeWidth={2}
//                       dot={{ r: 4 }}
//                       activeDot={{ r: 6 }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AIOptimizationAnalysis;


import React, { useState, useEffect } from 'react';
import './AIOptimizationAnalysis.css';
import { Player } from '@lottiefiles/react-lottie-player';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AIOptimizationAnalysis = ({ threatData, intruderInfo, threatHistory, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [recoveryData, setRecoveryData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [threatDistribution, setThreatDistribution] = useState([]);
  const [firewallBreachData, setFirewallBreachData] = useState([]);
  const [recoverySteps, setRecoverySteps] = useState([]);
  const [threatFrequencyData, setThreatFrequencyData] = useState([]);

  // Regenerate data when tab changes
  useEffect(() => {
    generateRandomData();
  }, [activeTab, threatData]);

  // Generate all random data
  const generateRandomData = () => {
    setRecoveryData(generateRecoveryData());
    setTimelineData(generateTimelineData());
    setThreatDistribution(generateThreatDistribution());
    setFirewallBreachData(generateFirewallBreachData());
    setRecoverySteps(generateRecoverySteps());
    setThreatFrequencyData(generateThreatFrequencyData());
  };

  // Map old level names to new level names
  const mapThreatLevel = (level) => {
    const levelMap = {
      'low': 'advisory',
      'middle': 'warning',
      'high': 'critical'
    };
    return levelMap[level] || level;
  };

  // Calculate threat severity score
  const calculateThreatScore = () => {
    if (!threatData || !threatData.types) return Math.floor(Math.random() * 100);

    const levelScores = {
      'advisory': 1,
      'warning': 2,
      'critical': 3,
      // Keep the old mappings for backward compatibility
      'low': 1,
      'middle': 2,
      'high': 3
    };

    let totalScore = 0;
    let totalPossible = 0;

    threatData.types.forEach(threatType => {
      const mappedLevel = mapThreatLevel(threatType.level);
      totalScore += levelScores[mappedLevel] || 0;
      totalPossible += 3; // Maximum possible score for each type
    });

    return totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : Math.floor(Math.random() * 100);
  };

  const threatScore = calculateThreatScore();

  // Generate random system recovery data
  function generateRecoveryData() {
    const steps = [
      'System Analysis',
      'Threat Identification',
      'Network Isolation',
      'Data Backup Verification',
      'Malware Removal',
      'System Patching',
      'Firewall Reconfiguration',
      'Security Rule Updates',
      'System Restoration',
      'Integrity Verification'
    ];

    return steps.map((step, index) => ({
      name: step,
      value: Math.floor(Math.random() * 60) + 30, // Random time between 30-90 seconds
      fill: index % 2 === 0 ? '#4ade80' : '#3b82f6'
    }));
  }

  // Generate random recovery timeline data
  function generateTimelineData() {
    const data = [];
    const now = new Date();
    let baseRecovery = Math.floor(Math.random() * 30);
    let baseActivity = 100 - Math.floor(Math.random() * 20);

    for (let i = 0; i < 10; i++) {
      const date = new Date(now.getTime() - (9 - i) * 5 * 60000); // 5 minute intervals going back

      // More random progression with some variations
      baseRecovery += Math.floor(Math.random() * 12) + 4;
      baseActivity -= Math.floor(Math.random() * 12) + 4;

      data.push({
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recovery: Math.min(100, baseRecovery), // 0% to 100% recovery progress
        activity: Math.max(0, baseActivity) // 100% to 0% malicious activity
      });
    }

    return data;
  }

  // Generate threat type distribution
  function generateThreatDistribution() {
    if (!threatData || !threatData.types || threatData.types.length === 0) {
      return [
        { name: 'WLAN', value: Math.floor(Math.random() * 30) + 5 },
        { name: 'TCP/IP', value: Math.floor(Math.random() * 30) + 5 },
        { name: 'HTTP', value: Math.floor(Math.random() * 30) + 5 },
        { name: 'Firewall', value: Math.floor(Math.random() * 30) + 5 }
      ];
    }

    const threatCounts = {
      'WLAN': 0,
      'TCPIP': 0,
      'HTTP': 0,
      'Firewall': 0
    };

    threatData.types.forEach(threat => {
      const mappedLevel = mapThreatLevel(threat.level);
      threatCounts[threat.type] += mappedLevel === 'advisory' ? 1 :
        mappedLevel === 'warning' ? 2 : 3;
    });

    // Add some randomness to the values
    Object.keys(threatCounts).forEach(key => {
      threatCounts[key] = Math.max(1, threatCounts[key] + Math.floor(Math.random() * 3) - 1);
    });

    return Object.entries(threatCounts).map(([key, value]) => ({
      name: key === 'TCPIP' ? 'TCP/IP' : key,
      value: value > 0 ? value : 1 // Ensure at least a small slice for visualization
    }));
  }

  // Firewall breach timeline data
  function generateFirewallBreachData() {
    return [
      { name: 'Perimeter Firewall', timeToBreak: Math.floor(Math.random() * 20) + 5 },
      { name: 'Network Firewall', timeToBreak: Math.floor(Math.random() * 15) + 15 },
      { name: 'Application Firewall', timeToBreak: Math.floor(Math.random() * 10) + 25 },
      { name: 'Data Firewall', timeToBreak: Math.floor(Math.random() * 5) + 30 }
    ];
  }

  function generateRecoverySteps() {
    const completedSteps = Math.floor(Math.random() * 3) + 2; // 2-4 completed steps
    const inProgressSteps = Math.floor(Math.random() * 2) + 1; // 1-2 in progress steps

    const allSteps = [
      { name: 'Network Isolation', status: 'pending', progress: 0 },
      { name: 'Threat Identification', status: 'pending', progress: 0 },
      { name: 'System Backup', status: 'pending', progress: 0 },
      { name: 'Malware Removal', status: 'pending', progress: 0 },
      { name: 'Security Patching', status: 'pending', progress: 0 },
      { name: 'Firewall Reconfiguration', status: 'pending', progress: 0 },
      { name: 'Integrity Verification', status: 'pending', progress: 0 },
      { name: 'System Restoration', status: 'pending', progress: 0 }
    ];

    // Set completed steps
    for (let i = 0; i < completedSteps; i++) {
      if (i < allSteps.length) {
        allSteps[i].status = 'complete';
        allSteps[i].progress = 100;
      }
    }

    // Set in-progress steps
    for (let i = completedSteps; i < completedSteps + inProgressSteps; i++) {
      if (i < allSteps.length) {
        allSteps[i].status = 'in-progress';
        allSteps[i].progress = Math.floor(Math.random() * 85) + 15; // 15-99% complete
      }
    }

    return allSteps;
  }

  function generateThreatFrequencyData() {
    const data = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);

      data.push({
        date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        threats: Math.floor(Math.random() * 5)
      });
    }

    return data;
  }

  // Colors for pie chart
  const COLORS = ['#4ade80', '#3b82f6', '#f59e0b', '#ef4444'];

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Calculate overall recovery percentage
  const calculateOverallRecovery = () => {
    if (!recoverySteps || recoverySteps.length === 0) return 0;

    const totalProgress = recoverySteps.reduce((sum, step) => sum + step.progress, 0);
    return Math.round(totalProgress / recoverySteps.length);
  };

  // Generate random recovery time
  const getRandomRecoveryTime = () => {
    return Math.floor(Math.random() * 400) + 200; // 200-600 seconds
  };

  // Get actual recovery time or fall back to random
  const getRecoveryTime = () => {
    if (threatHistory && threatHistory.length > 0) {
      const latestThreat = threatHistory[threatHistory.length - 1];

      // Check different possible locations for totalBreachTime
      if (latestThreat.totalBreachTime) {
        return latestThreat.totalBreachTime;
      } else if (latestThreat.info && latestThreat.info.totalBreachTime) {
        return latestThreat.info.totalBreachTime;
      } else if (latestThreat.recoveryTime) {
        return latestThreat.recoveryTime;
      }
    }

    // Fall back to random time if no real data is available
    return getRandomRecoveryTime();
  };

  // Get random firewall breached count
  const getRandomFirewallBreached = () => {
    return `${Math.floor(Math.random() * 4) + 1}/4`;
  };

  // Get CSS class for threat level
  const getThreatLevelClass = (level) => {
    const mappedLevel = mapThreatLevel(level);
    return mappedLevel; // Use the mapped level as CSS class
  };

  // Get threat level display name
  const getThreatLevelDisplayName = (level) => {
    const mappedLevel = mapThreatLevel(level);
    return mappedLevel.charAt(0).toUpperCase() + mappedLevel.slice(1);
  };

  return (
    <div className="ai-optimization-analysis">
      <div className="analysis-header">
        <h2>AI Optimization Analysis</h2>
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-tachometer-alt"></i> Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'threats' ? 'active' : ''}`}
          onClick={() => setActiveTab('threats')}
        >
          <i className="fas fa-bug"></i> Threat Analysis
        </button>
        <button
          className={`tab-button ${activeTab === 'recovery' ? 'active' : ''}`}
          onClick={() => setActiveTab('recovery')}
        >
          <i className="fas fa-undo"></i> Recovery Process
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <i className="fas fa-history"></i> History
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <>
            <div className="overview-cards">
              <div className="analysis-card">
                <div className="card-icon red">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="card-content">
                  <h3>Threat Severity</h3>
                  <div className="card-value">{threatScore}%</div>
                  <div className="severity-bar">
                    <div
                      className="severity-fill"
                      style={{
                        width: `${threatScore}%`,
                        backgroundColor: threatScore < 40 ? '#4ade80' :
                          threatScore < 70 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="analysis-card">
                <div className="card-icon blue">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div className="card-content">
                  <h3>Firewalls Breached</h3>
                  <div className="card-value">{getRandomFirewallBreached()}</div>
                  <div className="card-subtitle">Security layers compromised</div>
                </div>
              </div>

              <div className="analysis-card">
                <div className="card-icon green">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="card-content">
                  <h3>Recovery Time</h3>
                  <div className="card-value">
                    {formatTime(threatHistory.length > 0 ?
                      Math.floor(Math.random() * (threatHistory[threatHistory.length - 1].recoveryTime)) :
                      getRandomRecoveryTime())}
                  </div>
                  <div className="card-subtitle">Estimated system restoration</div>
                </div>
              </div>

              <div className="analysis-card">
                <div className="card-icon orange">
                  <i className="fas fa-network-wired"></i>
                </div>
                <div className="card-content">
                  <h3>Attack Source</h3>
                  <div className="card-value">
                    {intruderInfo?.ip || `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`}
                  </div>
                  <div className="card-subtitle">
                    {intruderInfo?.location || ['Unknown Location', 'New York, USA', 'Beijing, China', 'Moscow, Russia', 'London, UK'][Math.floor(Math.random() * 5)]}
                  </div>
                </div>
              </div>
            </div>

            <div className="analysis-charts">
              <div className="chart-container">
                <h3>System Recovery Timeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="recovery"
                      stroke="#4ade80"
                      name="Recovery Progress (%)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="activity"
                      stroke="#ef4444"
                      name="Malicious Activity (%)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Threat Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={threatDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {threatDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'threats' && (
          <>
            <div className="threat-details">
              <div className="threat-info-panel">
                <h3>Threat Details</h3>
                {threatData && threatData.types ? (
                  <div className="threat-types-container">
                    {threatData.types.map((type, index) => {
                      // Add some randomness to the description
                      const descriptions = {
                        'WLAN': [
                          'Wireless network communication interception',
                          'WiFi protocol vulnerability exploitation',
                          'Unauthorized wireless access point detected'
                        ],
                        'TCPIP': [
                          'Network protocol layer exploitation',
                          'IP spoofing attack detected',
                          'TCP sequence prediction attack'
                        ],
                        'HTTP': [
                          'Web application vulnerability exploitation',
                          'Cross-site scripting (XSS) attack',
                          'SQL injection attempt detected'
                        ],
                        'Firewall': [
                          'Security boundary penetration',
                          'Firewall rule bypass detected',
                          'Packet filter evasion attempt'
                        ]
                      };

                      const descriptionArray = descriptions[type.type] || ['Unknown threat type'];
                      const randomDesc = descriptionArray[Math.floor(Math.random() * descriptionArray.length)];
                      const mappedLevel = mapThreatLevel(type.level);

                      return (
                        <div key={index} className={`threat-type-card ${mappedLevel}`}>
                          <div className="threat-icon">
                            <i className={`fas ${type.type === 'WLAN' ? 'fa-wifi' :
                                type.type === 'TCPIP' ? 'fa-network-wired' :
                                  type.type === 'HTTP' ? 'fa-globe' : 'fa-shield-alt'
                              }`}></i>
                          </div>
                          <div className="threat-type-content">
                            <h4>{type.type === 'TCPIP' ? 'TCP/IP' : type.type}</h4>
                            <div className="threat-level">
                              <span className="level-indicator"></span>
                              {getThreatLevelDisplayName(type.level)} Priority
                            </div>
                            <div className="threat-description">{randomDesc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-data">No threat data available</div>
                )}
              </div>

              <div className="chart-container">
                <h3>Firewall Breach Timeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={firewallBreachData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Seconds to Breach', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={() => [``]} />
                    <Legend />
                    <Bar
                      dataKey="timeToBreak"
                      name={`Breach Time (${getRecoveryTime()} seconds)`}
                      fill="#ef4444"
                    // Remove the label property entirely to get rid of the black text on bars
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="vulnerability-map">
                <h3>Attack Vector Analysis</h3>
                <div className="map-container">
                  <Player
                    autoplay
                    loop
                    src="https://assets10.lottiefiles.com/packages/lf20_ffkzpglj.json"
                    style={{ height: '300px', width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'recovery' && (
          <>
            <div className="recovery-status">
              <div className="recovery-header">
                <h3>System Recovery Progress</h3>
                <div className="recovery-timer">
                  Elapsed Time: {formatTime(threatHistory.length > 0 ?
                    Math.floor(Math.random() * threatHistory[threatHistory.length - 1].recoveryTime) :
                    Math.floor(Math.random() * 300) + 60)}
                </div>
              </div>

              <div className="progress-container">
                <div className="overall-progress">
                  <div className="progress-label">Overall Recovery:</div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${calculateOverallRecovery()}%` }}
                    ></div>
                  </div>
                  <div className="progress-percentage">{calculateOverallRecovery()}%</div>
                </div>

                <div className="recovery-steps">
                  {recoverySteps.map((step, index) => (
                    <div key={index} className={`recovery-step ${step.status}`}>
                      <div className="step-status-icon">
                        {step.status === 'complete' ? (
                          <i className="fas fa-check-circle"></i>
                        ) : step.status === 'in-progress' ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="far fa-clock"></i>
                        )}
                      </div>
                      <div className="step-details">
                        <div className="step-name">{step.name}</div>
                        <div className="step-progress-bar">
                          <div
                            className="step-progress-fill"
                            style={{ width: `${step.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="step-percentage">{step.progress}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-container">
                <h3>Recovery Time by Process</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={recoveryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }} />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value) => [`${value} seconds`, 'Time']} />
                    <Legend />
                    <Bar dataKey="value" name="Recovery Time (seconds)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <>
            <div className="history-container">
              <h3>Threat History Log</h3>

              {threatHistory.length > 0 ? (
                <div className="history-table">
                  <div className="table-header">
                    <div className="header-cell">Date & Time</div>
                    <div className="header-cell">IP Address</div>
                    <div className="header-cell">Origin</div>
                    <div className="header-cell">Threat Level</div>
                    <div className="header-cell">Recovery Time</div>
                    <div className="header-cell">Status</div>
                  </div>

                  <div className="table-body">
                    {[...threatHistory].reverse().map((threat, index) => {
                      // Calculate the threat level based on types
                      let threatLevel = 'advisory';
                      if (threat.info && threat.info.types) {
                        if (threat.info.types.some(t => t.level === 'high' || t.level === 'critical')) {
                          threatLevel = 'critical';
                        } else if (threat.info.types.some(t => t.level === 'middle' || t.level === 'warning')) {
                          threatLevel = 'warning';
                        }
                      } else {
                        threatLevel = ['advisory', 'warning', 'critical'][Math.floor(Math.random() * 3)];
                      }

                      return (
                        <div key={index} className="table-row">
                          <div className="table-cell">
                            {new Date(threat.timestamp).toLocaleString()}
                          </div>
                          <div className="table-cell">
                            {threat.info?.ip || `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`}
                          </div>
                          <div className="table-cell">
                            {threat.info?.location || ['Unknown', 'New York, USA', 'Beijing, China', 'Moscow, Russia', 'London, UK'][Math.floor(Math.random() * 5)]}
                          </div>
                          <div className="table-cell">
                            <span className={`threat-badge ${threatLevel}`}>
                              {threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1)}
                            </span>
                          </div>
                          <div className="table-cell">
                            {formatTime(Math.floor(Math.random() * 300) + threat.recoveryTime / 2)}
                          </div>
                          <div className="table-cell">
                            <span className="status-indicator resolved">Resolved</span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add some fake history items for visual effect */}
                    {threatHistory.length < 5 && (
                      Array.from({ length: 5 - threatHistory.length }).map((_, index) => {
                        const randomDate = new Date();
                        randomDate.setDate(randomDate.getDate() - (index + 1));

                        const levels = ['advisory', 'warning', 'critical'];
                        const randomLevel = levels[Math.floor(Math.random() * levels.length)];
                        const locations = ['New York, USA', 'Beijing, China', 'Moscow, Russia', 'London, UK', 'Toronto, Canada', 'Sydney, Australia'];

                        return (
                          <div key={`fake-${index}`} className="table-row">
                            <div className="table-cell">
                              {randomDate.toLocaleString()}
                            </div>
                            <div className="table-cell">
                              {`192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`}
                            </div>
                            <div className="table-cell">
                              {locations[Math.floor(Math.random() * locations.length)]}
                            </div>
                            <div className="table-cell">
                              <span className={`threat-badge ${randomLevel}`}>
                                {randomLevel.charAt(0).toUpperCase() + randomLevel.slice(1)}
                              </span>
                            </div>
                            <div className="table-cell">
                              {formatTime(Math.floor(Math.random() * 600) + 300)}
                            </div>
                            <div className="table-cell">
                              <span className="status-indicator resolved">Resolved</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : (
                <div className="no-history">
                  <i className="fas fa-history"></i>
                  <p>No threat history available yet.</p>
                  <p>Past threats and their analysis will appear here.</p>
                </div>
              )}

              <div className="chart-container">
                <h3>Threat Frequency Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={threatFrequencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="threats"
                      stroke="#3b82f6"
                      name="Number of Threats"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIOptimizationAnalysis;