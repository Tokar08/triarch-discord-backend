import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import routes from './routes/index.js';


const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

app.listen(env.PORT, () => {
    console.log(` Triarch Backend listening on http://localhost:${env.PORT}`);
});