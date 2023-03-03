import http from 'http';
import path from 'path';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';

import HotelManager from './HotelManager';
import { corsOptions } from './utils';

import { Client, generateUsername } from './Client';

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

type SocketClientRequestType = 'create-room' | 'join-room' | 'update-room';

type SocketClientRequest = {
    username?: string,
    password?: string,
    roomID?: string,
    type: SocketClientRequestType,
}


const SocketEvent = {
    connection: {
        init: 'connection',
        end: 'disconnect',
        error: 'connection-error',
        success: 'connection-success'
    },
    editor: {
        full: {
            send: 'send-full-editor',
            receive: 'receive-full-editor',
        },
        js: {
            send: 'send-js-editor',
            receive: 'receive-js-editor',
        },
        html: {
            send: 'send-html-editor',
            receive: 'receive-html-editor',
        },
        css: {
            send: 'send-css-editor',
            receive: 'receive-css-editor',
        },
    },
} as const;

function isSocketClientRequest(v: any): v is SocketClientRequest {
    // return 'username' in v && 'password' in v && 'roomID' in v && 'type' in v;
    return 'type' in v; // only field required, the rest is optional
}

const hotel = new HotelManager<4, Client>();

io.on(SocketEvent.connection.init, async (socket) => {

    const login = JSON.parse(socket.handshake.query.login as string);

    if (isSocketClientRequest(login)) {
        const roomID = login.roomID ?? false;

        if (login.type === 'create-room') {
            const username: string = login.username ?? generateUsername();

            const roomID = hotel.createRoom({
                username: username,
                id: socket.id,
            });

            socket.emit(SocketEvent.connection.success, { roomID });
        }
        else if (login.type === 'join-room') {
            if (!roomID) {
                socket.emit(SocketEvent.connection.error);
                socket.disconnect();
                return;
            }

            const checkOperation = hotel.checkRoom(roomID, login.password);

            if (checkOperation.error || !checkOperation.out) {
                socket.emit(SocketEvent.connection.error, { msgs: checkOperation.msgs });
                socket.disconnect();
                return;
            }

            const username: string = login.username ?? generateUsername([...checkOperation.out.participants.map((p) => p ? p.username : null)]);

            const operationResult = hotel.joinRoom(roomID, {
                username: username,
                id: socket.id,
            });

            if (operationResult.error) {
                socket.emit(SocketEvent.connection.error, { msgs: operationResult.msgs });
                socket.disconnect();
                return;
            }

            await socket.join(roomID);

            socket.broadcast.to(roomID).emit(SocketEvent.editor.full.receive);

            socket.on(SocketEvent.editor.full.send, (data) => {
                socket.emit(SocketEvent.editor.full.receive, { data }); // {js: '', html: '', css: ''}
            });
        }
        else {
            if (roomID) {
                socket.on(SocketEvent.editor.js.send, (data) => {
                    socket.broadcast.to(roomID).emit(SocketEvent.editor.js.receive, { data });
                });
                socket.on(SocketEvent.editor.html.send, (data) => {
                    socket.broadcast.to(roomID).emit(SocketEvent.editor.html.receive, { data });
                });
                socket.on(SocketEvent.editor.css.send, (data) => {
                    socket.broadcast.to(roomID).emit(SocketEvent.editor.css.receive, { data });
                });
            }
        }

        socket.on(SocketEvent.connection.end, () => {
            if (roomID) {
                const checkOperation = hotel.checkRoom(roomID, login.password);

                if (checkOperation.out) {
                    const removedParticipantID: number = checkOperation.out.participants.findIndex((p) => p && (p.id === socket.id));
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


