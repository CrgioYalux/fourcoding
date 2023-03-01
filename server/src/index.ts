import http from 'http';
import path from 'path';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';

import HotelManager from './HotelManager';

import { corsOptions } from './utils';

import type { Client } from './Client';

const pathToBuild: string =
    process.env.NODE_ENV === 'dev'
        ? path.join(__dirname, '..', '..', 'client', 'dist')
        : path.join(__dirname, '..', '..', '..', 'client', 'dist');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(pathToBuild));

const server = http.createServer(app);

const io = new Server(server, {
    path: '/socket/',
    serveClient: false,
    cors: corsOptions,
});

const hotel = new HotelManager<4, Client>();

const PORT = Number(process.env.PORT) || 4000;
server.listen(PORT, () => {
    console.log(`server listening on localhost:${PORT}`);
});


