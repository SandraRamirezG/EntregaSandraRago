//lógica para manejar errores comunes

const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = errorHandler;