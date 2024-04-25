const winston = require('winston');

// Definir niveles de log
const levels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
};

// Configurar transportes
const transports = [
    // Transporte para consola en desarrollo
    new winston.transports.Console({
        level: 'debug'
    }),
    // Transporte para archivos en producción
    new winston.transports.File({
        filename: 'errors.log',
        level: 'error'
    })
];

// Configurar logger
const logger = winston.createLogger({
    levels: levels,
    transports: transports
});

module.exports = logger;