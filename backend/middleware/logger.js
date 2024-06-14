const morgan = require('morgan');
const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});

const stream = {
  write: (message) => logger.info(message.trim())
};

module.exports = morgan('combined', { stream });
