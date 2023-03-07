import http from 'http';
import path from 'path';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';

import HotelManager from './HotelManager';
import { corsOptions } from './utils';

import { Client, generateUsername } from './Client';

import type { Socket } from 'socket.io';

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

interface ServerToClientEvents {
    'connection-success': (data: {participants: (string | null)[]} | {msgs: string[]} | {roomID: string}) => void;
    'connection-error': (data: { msgs: string[] }) => void;

    'get-full-editor': () => void;

    'send-full-editor': (data: {js: string, html: string, css: string}) => void;
    'send-js-editor': (data: {js: string}) => void;
    'send-html-editor': (data: {html: string}) => void;
    'send-css-editor': (data: {css: string}) => void;
}

interface ClientToServerEvents {
    'connect': (callback: (socket: Socket) => void) => void;
    'disconnect': () => void;

    'send-full-editor': (data: {js: string, html: string, css: string}) => void;
    'send-js-editor': (data: {js: string}) => void;
    'send-html-editor': (data: {html: string}) => void;
    'send-css-editor': (data: {css: string}) => void;
}

interface InterServerEvents {
    'ping': () => void;
}

type ClientInitialRequest = {
    username?: string,
    password?: string,
    roomID?: string,
    type: 'create-room' | 'join-room',
}

interface SocketData {
    clientHandshake: ClientInitialRequest;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
    path: '/socket/',
    serveClient: false,
    cors: corsOptions,
});

const hotel = new HotelManager<4, Client>();


function isClientInitialRequest(v: any): v is ClientInitialRequest {
    return 'type' in v;
}

io.on('connect', async (socket) => {
    if (typeof socket.handshake.query.clientInitialRequest !== 'string') return;

    const clientInitialRequest = JSON.parse(socket.handshake.query.clientInitialRequest as string);

    console.log(clientInitialRequest);

    if (isClientInitialRequest(clientInitialRequest)) {
        const type = clientInitialRequest.type;
        const password = clientInitialRequest.password;

        if (type === 'create-room') {
            const username = clientInitialRequest.username ?? generateUsername();

            const roomID = hotel.createRoom({
                username: username,
                id: socket.id,
            }, password);

            socket.emit('connection-success', { roomID });
        }
        else if (type === 'join-room') {
            const roomID = clientInitialRequest.roomID;

            if (!roomID) {
                socket.emit('connection-error', { msgs: ['No roomID provided'] });
                socket.disconnect();
                return;
            }

            const checkOperation = hotel.checkRoom(roomID, password);

            if (checkOperation.error || !checkOperation.out) {
                socket.emit('connection-error', { msgs: checkOperation.msgs });
                socket.disconnect();
                return;
            }

            const username = clientInitialRequest.username ?? generateUsername([...checkOperation.out.participants.map((p) => p ? p.username : null)]);

            const operationResult = hotel.joinRoom(roomID, {
                username: username,
                id: socket.id,
            }, password);

            if (operationResult.error) {
                socket.emit('connection-error', { msgs: operationResult.msgs });
                socket.disconnect();
                return;
            }

            await socket.join(roomID);

            socket.emit('connection-success', { participants: [...checkOperation.out.participants.map((p) => p ? p.username : null)] });
            socket.broadcast.to(roomID).emit('get-full-editor');

            socket.on('send-full-editor', (data) => {
                socket.emit('send-full-editor', data);
            });
        }
        else {
            const roomID = clientInitialRequest.roomID;
            if (roomID) {
                socket.on('send-js-editor', (data) => {
                    socket.broadcast.to(roomID).emit('send-js-editor', data);
                });
                socket.on('send-html-editor', (data) => {
                    socket.broadcast.to(roomID).emit('send-html-editor', data);
                });
                socket.on('send-css-editor', (data) => {
                    socket.broadcast.to(roomID).emit('send-css-editor', data);
                });
            }
        }

        socket.on('disconnect', () => {
            if (clientInitialRequest) {
                const roomID = clientInitialRequest.roomID;
                const password = clientInitialRequest.password;

                if (!roomID) return;

                const checkOperation = hotel.checkRoom(roomID, password);

                if (checkOperation.out) {
                    const removedParticipantID = checkOperation.out.participants.findIndex((p) => p && (p.id === socket.id));
                    hotel.removeFromRoom(roomID, removedParticipantID);
                    socket.leave(roomID);
                }
            }
        });
    }
});

const PORT = Number(process.env.PORT) || 4000;
server.listen(PORT, () => {
    console.log(`server listening on localhost:${PORT}`);
});


