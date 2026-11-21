import { Redis } from 'ioredis';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        return Math.min(times * 50, 2000);
    },
});

redis.on('connect', () => {
    logger.info('Redis connected');
});

redis.on('error', (error) => {
    logger.error({ err: error }, 'Redis connection error');
});

redis.on('close', () => {
    logger.warn('Redis connection closed');
});