import { Router, Request, Response } from 'express';
import { env } from '../config/env.js';
import { generateAuthUrl, exchangeCodeForToken, fetchDiscordUser, fetchGuildMember } from '../services/discord.service.js';
import { createSession } from '../services/session.service.js';

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

        res.redirect(`${env.FRONTEND_URL}/profile`);
    } catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).send('Authentication failed');
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