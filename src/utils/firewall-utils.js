// This file contains utility functions for the firewall system

// Function to generate random IP addresses
export const generateRandomIP = () => {
    const segments = [];
    for (let i = 0; i < 4; i++) {
      segments.push(Math.floor(Math.random() * 255));
    }
    return segments.join('.');
  };
  
  // Function to generate fake device information
  export const generateDeviceInfo = () => {
    const devices = [
      'MacBook Pro (Intel i9)',
      'Dell XPS 15 (Windows 11)',
      'Lenovo ThinkPad X1 Carbon',
      'HP Spectre x360',
      'ASUS ROG Gaming Laptop',
      'Microsoft Surface Pro'
    ];
    
    const browsers = [
      'Chrome 112.0.5615.121',
      'Firefox 109.0.1',
      'Safari 16.4',
      'Edge 112.0.1722.58',
      'Opera 97.0.4719.83'
    ];
    
    const device = devices[Math.floor(Math.random() * devices.length)];
    const browser = browsers[Math.floor(Math.random() * browsers.length)];
    
    return `${device} - ${browser}`;
  };
  
  // Function to generate a timestamp
  export const generateTimestamp = () => {
    const now = new Date();
    return now.toLocaleString();
  };
  
  // Firewall security levels
  export const firewallLevels = {
    LEVEL_1: {
      difficulty: 'Easy',
      description: 'Basic security with simple encoding',
      byteCodeLength: 8
    },
    LEVEL_2: {
      difficulty: 'Medium',
      description: 'Enhanced security with dual-layer encryption',
      byteCodeLength: 16
    },
    LEVEL_3: {
      difficulty: 'Hard',
      description: 'Advanced protection with symmetric key algorithms',
      byteCodeLength: 24
    },
    LEVEL_4: {
      difficulty: 'Extreme',
      description: 'Military-grade encryption with quantum-resistant algorithms',
      byteCodeLength: 32
    }
  };
  
  // Function to analyze breach attempts
  export const analyzeBreachAttempt = (code, level) => {
    // In a real application, this would contain actual logic
    // For now, we'll just check if the code matches the expected pattern for the level
    
    const validPattern = new RegExp(`^0x[A-Fa-f0-9]{${firewallLevels['LEVEL_' + level].byteCodeLength}}$`);
    return validPattern.test(code);
  };
  