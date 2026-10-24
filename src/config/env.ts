import { z as zod } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = zod.object({
    PORT: zod.coerce.number().default(3001),
    DISCORD_CLIENT_ID: zod.string().min(1, 'DISCORD_CLIENT_ID is required'),
    DISCORD_CLIENT_SECRET: zod.string().min(1, 'DISCORD_CLIENT_SECRET is required'),
    GUILD_ID: zod.string().regex(/^\d+$/, 'GUILD_ID must be a number'),
});

export const env = envSchema.parse(process.env);