const formatMessage = (level, message) =>
  `[${new Date().toISOString()}] [${level}] ${message}`;

export const logger = {
  info: (message) => console.log(formatMessage('INFO', message)),
  warn: (message) => console.warn(formatMessage('WARN', message)),
  error: (message) => console.error(formatMessage('ERROR', message)),
};
