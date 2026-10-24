import crypto from 'node:crypto';
import { env } from '../config/env.js';
import type { DiscordOAuth2Config } from '../types/discord.types.js';

export function generateAuthUrl(): { url: string; state: string } {
    const state = crypto.randomBytes(16).toString('hex');

    console.log('Отправляем в Discord redirect_uri:', env.DISCORD_REDIRECT_URI);


    const params = new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        redirect_uri: env.DISCORD_REDIRECT_URI,
        response_type: 'code',
        scope: env.DISCORD_SCOPES,
        state: state
    });

    const url = `https://discord.com/oauth2/authorize?${params.toString()}`;

    return { url, state };
}