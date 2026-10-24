import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Triarch Discord Backend is running',
        timestamp: new Date().toISOString()
    });
});

export default router;