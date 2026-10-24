import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Triarch Discord Backend is running',
        timestamp: new Date().toISOString()
    });
});

router.use('/api/auth', authRoutes);

export default router;