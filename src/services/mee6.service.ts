import { env } from '../config/env.js';
import type { Mee6Player, Mee6Level } from '../types/mee6.types.js';
import { logger } from '../utils/logger.js';

const MEE6_CACHE_TTL = 1 * 60 * 1000;

interface CacheEntry {
    data: Mee6Player[];
    expiresAt: number;
}

let leaderboardCache: CacheEntry | null = null;

async function fetchLeaderboard(): Promise<Mee6Player[]> {
    if (leaderboardCache && leaderboardCache.expiresAt > Date.now()) {
        logger.debug('[MEE6] Cache hit');
        return leaderboardCache.data;
    }

    logger.info('[MEE6] Cache miss, fetching from API');

    const url = `https://mee6.xyz/api/plugins/levels/leaderboard/${env.GUILD_ID}?limit=1000&page=0`;

    const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Triarch Backend)' },
    });

    if (!response.ok) {
        throw new Error(`MEE6 API error: ${response.status}`);
    }

    const data = await response.json();
    const players: Mee6Player[] = data.players || [];

    leaderboardCache = {
        data: players,
        expiresAt: Date.now() + MEE6_CACHE_TTL,
    };

    return players;
}

export async function getMee6Level(discordId: string): Promise<Mee6Level | null> {
    try {
        const players = await fetchLeaderboard();
        const player = players.find((p) => p.id === discordId);

        if (!player) {
            return null;
        }

        return {
            level: player.level,
            xp: player.xp,
            messages: player.message_count,
            rank: players.indexOf(player) + 1,
        };
    } catch (error) {
        logger.error({ err: error, discordId }, 'Error fetching MEE6 level');
        return null;
    }
}