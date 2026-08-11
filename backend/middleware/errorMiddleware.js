import logger from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode || 500;
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};