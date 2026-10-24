import crypto from 'node:crypto';
import type { SessionData } from '../types/session.types.js';

const sessions = new Map<string, SessionData>();

export function createSession(data: SessionData): string {
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, data);
    return token;
}

export function getSession(token: string): SessionData | undefined {
    return sessions.get(token);
}

export function deleteSession(token: string): void {
    sessions.delete(token);
}