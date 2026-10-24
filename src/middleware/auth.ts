import { Request, Response, NextFunction } from 'express';
import { getSession } from '../services/session.service.js';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const sessionToken = req.cookies?.session;

    if (!sessionToken) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    const session = getSession(sessionToken);

    if (!session) {
        return res.status(401).json({ error: 'Сессия недействительна' });
    }

    (req as any).session = session;
    next();
}