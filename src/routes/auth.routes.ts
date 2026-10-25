import { Router, Request, Response, NextFunction } from 'express';
import { z as zod } from 'zod';
import { env } from '../config/env.js';
import { generateAuthUrl, exchangeCodeForToken, fetchDiscordUser, fetchGuildMember } from '../services/discord.service.js';
import { createSession } from '../services/session.service.js';
import { logger } from '../utils/logger.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const callbackQuerySchema = zod.object({
    code: zod.string().min(1, 'Code is required'),
    state: zod.string().min(1, 'State is required'),
});

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

router.get('/callback', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validation = callbackQuerySchema.safeParse(req.query);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Invalid query parameters',
                details: validation.error.issues
            });
        }

        const { code, state } = validation.data;

        if (state !== req.cookies?.oauth_state) {
            return res.status(403).json({ error: 'Invalid state parameter' });
        }

        res.clearCookie('oauth_state');

        const accessToken = await exchangeCodeForToken(code);
        const user = await fetchDiscordUser(accessToken);
        const member = await fetchGuildMember(accessToken);

        const sessionToken = createSession({
            discordId: user.id,
            username: user.global_name || user.username,
            avatar: user.avatar,
            nick: member.nick,
        });

        res.cookie('session', sessionToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax',
            path: '/',
        });

        logger.info({ discordId: user.id, username: user.username }, 'User successfully logged in');

        res.redirect(`${env.FRONTEND_URL}/profile`);
    } catch (error) {
        next(error);
    }
});

router.get('/logout', (req: Request, res: Response) => {
    const sessionToken = req.cookies?.session;

    if (sessionToken) {
        const { deleteSession } = require('../services/session.service.js');
        deleteSession(sessionToken);
    }

    res.clearCookie('session');
    res.redirect(`${env.FRONTEND_URL}/`);
});

export default router;