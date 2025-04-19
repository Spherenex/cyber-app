// import React, { useState } from 'react';
// import './ThreatGenerator.css';
// import { Player } from '@lottiefiles/react-lottie-player';
// import { generateRandomIP } from '../../utils/firewall-utils';

// const ThreatGenerator = ({ onThreatGenerated }) => {
//     const [threatTypes, setThreatTypes] = useState({
//         WLAN: { selected: false, level: null },
//         TCPIP: { selected: false, level: null },
//         HTTP: { selected: false, level: null },
//         Firewall: { selected: false, level: null }
//     });

//     const [generatedIP, setGeneratedIP] = useState(null);
//     const [alertVisible, setAlertVisible] = useState(false);
//     const [threatGenerated, setThreatGenerated] = useState(false);

//     const handleCheckboxChange = (type, level) => {
//         setThreatTypes(prev => ({
//             ...prev,
//             [type]: {
//                 ...prev[type],
//                 selected: true,
//                 level
//             }
//         }));
//     };

//     const generateThreat = () => {
//         const hasSelectedThreats = Object.values(threatTypes).some(threat => threat.selected);

//         if (!hasSelectedThreats) {
//             alert("Please select at least one threat type");
//             return;
//         }

//         // Generate random IP
//         const ip = generateRandomIP();
//         setGeneratedIP(ip);

//         // Show alert
//         setAlertVisible(true);
//         setTimeout(() => setAlertVisible(false), 3000);

//         // Set threat as generated
//         setThreatGenerated(true);
//     };

//     const sendHacking = () => {
//         if (!threatGenerated) {
//             alert("Please generate a threat first");
//             return;
//         }

//         // Collect threat data to send to parent component
//         const threatData = {
//             ip: generatedIP,
//             types: Object.entries(threatTypes)
//                 .filter(([_, value]) => value.selected)
//                 .map(([key, value]) => ({
//                     type: key,
//                     level: value.level
//                 }))
//         };

//         onThreatGenerated(threatData);
//     };

//     return (
//         <div className="threat-generator">
//             <div className="threat-header">
//                 <div className="threat-title">
//                     <h2>Threat Generator</h2>
//                     <span className="subtitle">Select threat parameters to initiate</span>
//                 </div>
//                 <div className="animation-container">
//                 <Player
//   autoplay
//   loop
//   src="https://assets4.lottiefiles.com/packages/lf20_puciaact.json"
//   style={{ height: '150px', width: '100%' }}
// />
// </div>
//             </div>

//             {alertVisible && (
//                 <div className="alert-message success">
//                     <i className="fas fa-check-circle"></i>
//                     Threat Successfully Generated!
//                 </div>
//             )}

//             <div className="threat-protocols">
//                 {Object.keys(threatTypes).map(type => (
//                     <div key={type} className="protocol-card">
//                         <div className="protocol-header">
//                             <h3>{type === 'TCPIP' ? 'TCP/IP' : type}</h3>
//                             <div className="protocol-icon">
//                                 <i className={`fas ${type === 'WLAN' ? 'fa-wifi' :
//                                         type === 'TCPIP' ? 'fa-network-wired' :
//                                             type === 'HTTP' ? 'fa-globe' : 'fa-shield-alt'
//                                     }`}></i>
//                             </div>
//                         </div>

//                         <div className="level-selector">
//                             <div className="level-option">
//                                 <input
//                                     type="checkbox"
//                                     id={`${type}-Advisory`}
//                                     checked={threatTypes[type].level === 'Advisory'}
//                                     onChange={() => handleCheckboxChange(type, 'Advisory')}
//                                 />
//                                 <label htmlFor={`${type}-Advisory`}>Advisory</label>
//                             </div>

//                             <div className="level-option">
//                                 <input
//                                     type="checkbox"
//                                     id={`${type}-Warning`}
//                                     checked={threatTypes[type].level === 'Warning'}
//                                     onChange={() => handleCheckboxChange(type, 'Warning')}
//                                 />
//                                 <label htmlFor={`${type}-Warning`}>Warning</label>
//                             </div>

//                             <div className="level-option">
//                                 <input
//                                     type="checkbox"
//                                     id={`${type}-critical`}
//                                     checked={threatTypes[type].level === 'critical'}
//                                     onChange={() => handleCheckboxChange(type, 'critical')}
//                                 />
//                                 <label htmlFor={`${type}-critical`}>critical</label>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             <div className="threat-actions">
//                 <button
//                     className="generate-button"
//                     onClick={generateThreat}
//                 >
//                     Generate Threat
//                 </button>

//                 {generatedIP && (
//                     <div className="ip-display">
//                         <span className="ip-label">Generated Threat IP:</span>
//                         <span className="ip-value">{generatedIP}</span>
//                         <button
//                             className="send-hack-button"
//                             onClick={sendHacking}
//                         >
//                             <i className="fas fa-bug"></i> Send Hacking
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ThreatGenerator;

import React, { useState } from 'react';
import './ThreatGenerator.css';
import { Player } from '@lottiefiles/react-lottie-player';
import { generateRandomIP } from '../../utils/firewall-utils';

const ThreatGenerator = ({ onThreatGenerated }) => {
    const [threatTypes, setThreatTypes] = useState({
        WLAN: { selected: false, level: null },
        TCPIP: { selected: false, level: null },
        HTTP: { selected: false, level: null },
        Firewall: { selected: false, level: null }
    });

    const [generatedIP, setGeneratedIP] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [threatGenerated, setThreatGenerated] = useState(false);

    const handleCheckboxChange = (type, level) => {
        setThreatTypes(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                selected: true,
                level
            }
        }));
    };

    const generateThreat = () => {
        const hasSelectedThreats = Object.values(threatTypes).some(threat => threat.selected);

        if (!hasSelectedThreats) {
            alert("Please select at least one threat type");
            return;
        }

        // Generate random IP
        const ip = generateRandomIP();
        setGeneratedIP(ip);

        // Show alert
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000);

        // Set threat as generated
        setThreatGenerated(true);
    };

    const sendHacking = () => {
        if (!threatGenerated) {
            alert("Please generate a threat first");
            return;
        }

        // Collect threat data to send to parent component
        const threatData = {
            ip: generatedIP,
            types: Object.entries(threatTypes)
                .filter(([_, value]) => value.selected)
                .map(([key, value]) => ({
                    type: key,
                    level: value.level
                }))
        };

        onThreatGenerated(threatData);
    };

    return (
        <div className="threat-generator">
            <div className="threat-header">
                <div className="threat-title">
                    <h2>Threat Generator</h2>
                    <span className="subtitle">Select threat parameters to initiate</span>
                </div>
                <div className="animation-container">
                <Player
                  autoplay
                  loop
                  src="https://assets4.lottiefiles.com/packages/lf20_puciaact.json"
                  style={{ height: '150px', width: '100%' }}
                />
                </div>
            </div>

            {alertVisible && (
                <div className="alert-message success">
                    <i className="fas fa-check-circle"></i>
                    Threat Successfully Generated!
                </div>
            )}

            <div className="threat-protocols">
                {Object.keys(threatTypes).map(type => (
                    <div key={type} className="protocol-card">
                        <div className="protocol-header">
                            <h3>{type === 'TCPIP' ? 'TCP/IP' : type}</h3>
                            <div className="protocol-icon">
                                <i className={`fas ${type === 'WLAN' ? 'fa-wifi' :
                                        type === 'TCPIP' ? 'fa-network-wired' :
                                            type === 'HTTP' ? 'fa-globe' : 'fa-shield-alt'
                                    }`}></i>
                            </div>
                        </div>

                        <div className="level-selector">
                            <div className="level-option">
                                <input
                                    type="checkbox"
                                    id={`${type}-Advisory`}
                                    checked={threatTypes[type].level === 'Advisory'}
                                    onChange={() => handleCheckboxChange(type, 'Advisory')}
                                />
                                <label htmlFor={`${type}-Advisory`}>Advisory</label>
                            </div>

                            <div className="level-option">
                                <input
                                    type="checkbox"
                                    id={`${type}-Warning`}
                                    checked={threatTypes[type].level === 'Warning'}
                                    onChange={() => handleCheckboxChange(type, 'Warning')}
                                />
                                <label htmlFor={`${type}-Warning`}>Warning</label>
                            </div>

                            <div className="level-option">
                                <input
                                    type="checkbox"
                                    id={`${type}-critical`}
                                    checked={threatTypes[type].level === 'critical'}
                                    onChange={() => handleCheckboxChange(type, 'critical')}
                                />
                                <label htmlFor={`${type}-critical`}>Critical</label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="threat-actions">
                <button
                    className="generate-button"
                    onClick={generateThreat}
                >
                    Generate Threat
                </button>

                {generatedIP && (
                    <div className="ip-display">
                        <span className="ip-label">Generated Threat IP:</span>
                        <span className="ip-value">{generatedIP}</span>
                        <button
                            className="send-hack-button"
                            onClick={sendHacking}
                        >
                            <i className="fas fa-bug"></i> Send Hacking
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThreatGenerator;