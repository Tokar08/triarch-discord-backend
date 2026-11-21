import crypto from 'node:crypto';
import { redis } from './redis.service.js';
import type { SessionData } from '../types/session.types.js';
import { logger } from '../utils/logger.js';

export const SESSION_TTL = 7 * 24 * 60 * 60;

export async function createSession(data: SessionData): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    await redis.setex(`session:${token}`, SESSION_TTL, JSON.stringify(data));
    logger.debug({ discordId: data.discordId }, 'Session created in Redis');
    return token;
}

export async function getSession(token: string): Promise<SessionData | null> {
    const data = await redis.get(`session:${token}`);
    if (!data) {
        return null;
    }
    return JSON.parse(data) as SessionData;
}

export async function deleteSession(token: string): Promise<void> {
    await redis.del(`session:${token}`);
    logger.debug({ token: token.substring(0, 8) }, 'Session deleted from Redis');
}