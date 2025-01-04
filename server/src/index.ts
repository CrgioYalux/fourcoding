import http from 'http';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';

import { CONFIG } from './const';
import { Client, generateUsername } from './Client';
import HotelManager from './HotelManager';

import type {
	ServerToClientEvents,
	ClientToServerEvents,
	InterServerEvents,
	SocketData,
} from './utils';

const app = express();
app.use(cors(CONFIG.CORS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(CONFIG.PATH_TO_BUILD));
app.get('/health', (req, res) => {
	res.status(200).send('safe and sound').end();
});

const server = http.createServer(app);

const io = new Server<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>(server, {
	path: '/socket/',
	serveClient: false,
	cors: CONFIG.CORS,
});

const ROOM_SIZE = 4;
const hotel = new HotelManager<typeof ROOM_SIZE, Client>(ROOM_SIZE);

io.on('connect', (socket) => {
	socket.on('join-room', async (data) => {
		const checkOp = hotel.checkRoom(data.roomID, data.password);

		if (checkOp.error || !checkOp.out) {
			socket.emit('error', { msgs: checkOp.msgs });
			return;
		}

		const username =
			data.username ??
			generateUsername([
				...checkOp.out.participants.map((p) => (p ? p.username : null)),
			]);
		const joinOp = hotel.joinRoom(
			data.roomID,
			{
				username: username,
				id: socket.id,
			},
			data.password
		);

		if (joinOp.error || !joinOp.out) {
			socket.emit('error', { msgs: joinOp.msgs });
			return;
		}

		await socket.join(data.roomID);

		const room = {
			roomID: data.roomID,
			participants: [
				...joinOp.out.participants.map((p) => (p ? p.username : null)),
			],
		};

		socket.emit('join-room', room);
		socket.broadcast.to(data.roomID).emit('join-room', room);

		socket.broadcast.to(data.roomID).emit('get-full-editor');

		socket.data.clientHandshake = {
			roomID: data.roomID,
			username: username,
			password: data.password,
		};
	});
	socket.on('create-room', async (data) => {
		const username = data.username ?? generateUsername();

		const roomID = hotel.createRoom(
			{
				username: username,
				id: socket.id,
			},
			data.password
		);

		await socket.join(roomID);

		socket.emit('create-room', {
			roomID,
			participants: [username, null, null, null],
		});

		socket.data.clientHandshake = {
			roomID: roomID,
			username: username,
			password: data.password,
		};
	});
	socket.on('get-full-editor', () => {
		if (!socket.data.clientHandshake) return;
		socket.broadcast
			.to(socket.data.clientHandshake.roomID)
			.emit('get-full-editor');
	});
	socket.on('send-full-editor', (data) => {
		if (!socket.data.clientHandshake) return;
		socket.broadcast
			.to(socket.data.clientHandshake.roomID)
			.emit('send-full-editor', data);
	});
	socket.on('send-html-editor', (data) => {
		if (!socket.data.clientHandshake) return;
		socket.broadcast
			.to(socket.data.clientHandshake.roomID)
			.emit('send-html-editor', data);
	});
	socket.on('send-css-editor', (data) => {
		if (!socket.data.clientHandshake) return;
		socket.broadcast
			.to(socket.data.clientHandshake.roomID)
			.emit('send-css-editor', data);
	});
	socket.on('send-js-editor', (data) => {
		if (!socket.data.clientHandshake) return;
		socket.broadcast
			.to(socket.data.clientHandshake.roomID)
			.emit('send-js-editor', data);
	});

	socket.on('disconnect', () => {
		if (!socket.data.clientHandshake) return;

		const checkOperation = hotel.checkRoom(
			socket.data.clientHandshake.roomID,
			socket.data.clientHandshake.password
		);

		if (checkOperation.out) {
			const removedParticipantID =
				checkOperation.out.participants.findIndex(
					(p) => p && p.id === socket.id
				);
			hotel.removeFromRoom(
				socket.data.clientHandshake.roomID,
				removedParticipantID
			);

			const recheckOperation = hotel.checkRoom(
				socket.data.clientHandshake.roomID,
				socket.data.clientHandshake.password
			);
			if (recheckOperation.out) {
				if (
					recheckOperation.out.participants.filter((p) => p === null)
						.length === ROOM_SIZE
				) {
					hotel.deleteRoom(socket.data.clientHandshake.roomID);
				} else {
					socket.broadcast
						.to(socket.data.clientHandshake.roomID)
						.emit('left-room', {
							roomID: socket.data.clientHandshake.roomID,
							participants: [
								...recheckOperation.out.participants.map((p) =>
									p ? p.username : null
								),
							],
						});
				}
			}
		}

		socket.leave(socket.data.clientHandshake.roomID);
	});
});

const PORT = process.env.PORT ?? 4001;
server.listen(PORT, () => {
	console.log(`server listening on localhost:${PORT}`);
});
