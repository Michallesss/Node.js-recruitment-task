import express, { Application, NextFunction } from 'express';
const app: Application = express();
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import limiter from './middlewares/limiter.middleware';

const port: any = process.env.PORT || 3000;
app.listen(port, (): void => console.info('\x1b[32m','API host listening','\x1b[0m',`(on port ${port})...`))
.on('error', (err: any): void => console.error('\x1b[31m','Can not start the API host:','\x1b[0m',err));

const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_DATABASE }: any=process.env
const client=new Client({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_DATABASE,
});
client.connect();

// Config 
app.use(express.json());
app.use(helmet());
app.use('/', limiter)

// Routing
import films from './routes/films.routes';
app.use('/films', films);

import favorites from './routes/favorites.routes';
app.use('/favorites', favorites);

// ***Error handler***
// *404
// app.use();
// *500
// app.use();