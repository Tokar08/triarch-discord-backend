import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {getMee6Level} from "../services/mee6.service.js";

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
    const session = (req as any).session;
    const mee6 = await getMee6Level(session.discordId);


    res.json({
        user: {
            discordId: session.discordId,
            username: session.username,
            avatar: session.avatar,
            nick: session.nick,
        },
        mee6,
    });
});

export default router;