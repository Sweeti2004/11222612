const useLogger = () => {
  const log = (level, message, data = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
    
    // In a real app, this would send to a logging service
    // For this test, we'll store logs in memory and log to console (though normally we wouldn't)
    const logs = JSON.parse(localStorage.getItem('appLogs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('appLogs', JSON.stringify(logs));
    
    // Normally we wouldn't console.log, but for testing purposes:
    console.log(`[${level}] ${message}`, data);
  };
  
  return {
    logError: (message, data) => log('ERROR', message, data),
    logInfo: (message, data) => log('INFO', message, data),
    logWarning: (message, data) => log('WARNING', message, data),
    logDebug: (message, data) => log('DEBUG', message, data)
  };
};

export default useLogger;