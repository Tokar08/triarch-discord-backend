import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { generateAuthUrl, exchangeCodeForToken, fetchDiscordUser, fetchGuildMember } from '../services/discord.service.js';

const router = Router();

const sessions = new Map<string, { discordId: string; username: string; avatar: string | null; nick: string | null }>();

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

router.get('/callback', async (req: Request, res: Response) => {
    const { code, state } = req.query;

    if (!state || state !== req.cookies?.oauth_state) {
        return res.status(403).send('Invalid state parameter');
    }

    res.clearCookie('oauth_state');

    if (typeof code !== 'string') {
        return res.status(400).send('Missing authorization code');
    }

    try {
        const accessToken = await exchangeCodeForToken(code);
        const user = await fetchDiscordUser(accessToken);
        const member = await fetchGuildMember(accessToken);

        const sessionToken = crypto.randomBytes(32).toString('hex');

        sessions.set(sessionToken, {
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

        res.redirect(`${env.FRONTEND_URL}/profile`);
    } catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).send('Authentication failed');
    }
});

export default router;