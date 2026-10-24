import crypto from 'node:crypto';
import { env } from '../config/env.js';
import type { DiscordUser, DiscordGuildMember } from '../types/discord.types.js';

export function generateAuthUrl(): { url: string; state: string } {
    const state = crypto.randomBytes(16).toString('hex');

    const params = new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        redirect_uri: env.DISCORD_REDIRECT_URI,
        response_type: 'code',
        scope: env.DISCORD_SCOPES,
        state: state,
    });

    return { url: `https://discord.com/oauth2/authorize?${params.toString()}`, state };
}

export async function exchangeCodeForToken(code: string): Promise<string> {
    const params = new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: env.DISCORD_REDIRECT_URI,
    });

    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    if (!response.ok) {
        throw new Error(`Discord token exchange failed: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
}

export async function fetchDiscordUser(accessToken: string): Promise<DiscordUser> {
    const response = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch Discord user: ${response.status}`);
    }

    return response.json();
}

export async function fetchGuildMember(accessToken: string): Promise<DiscordGuildMember> {
    const response = await fetch(`https://discord.com/api/users/@me/guilds/${env.GUILD_ID}/member`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        throw new Error(`User is not a member of the guild or scope missing: ${response.status}`);
    }

    return response.json();
}