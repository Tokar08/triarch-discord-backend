import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, (req: Request, res: Response) => {
    const session = (req as any).session;

    res.json({
        discordId: session.discordId,
        username: session.username,
        avatar: session.avatar,
        nick: session.nick,
    });
});

export default router;