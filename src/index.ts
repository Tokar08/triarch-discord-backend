import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import routes from './routes/index.js';

const app = express();

app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/', routes);

app.listen(env.PORT, () => {
    console.log(`Triarch Backend listening on http://localhost:${env.PORT}`);
});