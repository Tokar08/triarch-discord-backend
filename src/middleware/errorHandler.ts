import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function notFoundHandler(req: Request, res: Response) {
    logger.warn({ url: req.url, method: req.method }, 'Route not found');
    res.status(404).json({ error: 'Маршрут не найден' });
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    logger.error(
        {
            err: {
                message: err.message,
                stack: err.stack,
            },
            url: req.url,
            method: req.method,
        },
        'Unhandled application error'
    );

    res.status(500).json({
        error: 'Внутренняя ошибка сервера. Попробуйте позже.'
    });
}