import { Router, Request, Response } from 'express';
import { generateAuthUrl } from '../services/discord.service.js';

const router = Router();


router.get('/login', (req: Request, res: Response) => {
    const { url, state } = generateAuthUrl();

    res.cookie('oauth_state', state, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
        sameSite: 'lax',
        path: '/',
    });

    res.redirect(url);
});

export default router;