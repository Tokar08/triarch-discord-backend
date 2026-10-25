import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import helmet from "helmet";

const app = express();

app.use(helmet());

app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/', routes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
    logger.info(`Triarch Backend listening on http://localhost:${env.PORT}`);
});