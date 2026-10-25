import pino from 'pino';

export const logger = pino({
    level: 'info',
    base: {
        pid: undefined,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});