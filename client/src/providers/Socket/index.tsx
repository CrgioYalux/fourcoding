import { createContext, useContext, useState, useEffect } from 'react';
import useSocket from '../../hooks/useSocket';

import type { Socket } from 'socket.io-client';
import type {
	CustomServerToClientEvents,
	CustomClientToServerEvents,
	ClientInitialRequest,
	OneRequiredRestOptional,
} from './utils';

type Room = {
	ID: string;
	participants: (string | null)[];
};

type SocketContextState = {
	socket: Socket<
		CustomServerToClientEvents,
		CustomClientToServerEvents
	> | null;
	room: Room | null;
	connected: boolean;
	isClientCreator: boolean;
	error: boolean;
	logs: string[];
};

type EditorData = {
	html: string;
	css: string;
	js: string;
};

type SocketContextActions = {
	joinRoom: (
		data: OneRequiredRestOptional<ClientInitialRequest, 'roomID'>
	) => void;
	createRoom: (data: Partial<ClientInitialRequest>) => void;

	getFullEditor: () => void;
	sendFullEditor: (data: EditorData) => void;
	sendHTMLEditor: (data: Pick<EditorData, 'html'>) => void;
	sendCSSEditor: (data: Pick<EditorData, 'css'>) => void;
	sendJSEditor: (data: Pick<EditorData, 'js'>) => void;
};

interface SocketContext {
	state: SocketContextState;
	actions: SocketContextActions;
}

const SocketContext = createContext<SocketContext>({
	state: {
		socket: null,
		room: null,
		connected: false,
		isClientCreator: false,
		error: false,
		logs: [],
	},
	actions: {
		joinRoom: () => {},
		createRoom: () => {},
		getFullEditor: () => {},
		sendFullEditor: () => {},
		sendHTMLEditor: () => {},
		sendCSSEditor: () => {},
		sendJSEditor: () => {},
	},
});

const useSocketContext = () => useContext<SocketContext>(SocketContext);

interface SocketProviderProps {
	children: React.ReactNode;
	url: string;
	path: string;
}

const SocketProvider: React.FC<SocketProviderProps> = ({
	children,
	url,
	path,
}) => {
	const { socket, connected, error, logs } = useSocket<
		Socket<CustomServerToClientEvents, CustomClientToServerEvents>
	>(url, path);
	const [room, setRoom] = useState<Room | null>(null);
	const [isClientCreator, setIsClientCreator] = useState<boolean>(false);

	useEffect(() => {
		if (!socket) return;

		socket.on('create-room', (data) => {
			setRoom({ participants: data.participants, ID: data.roomID });
			setIsClientCreator(true);
		});

		socket.on('join-room', (data) => {
			setRoom({ participants: data.participants, ID: data.roomID });
		});

		socket.on('left-room', (data) => {
			setRoom({ participants: data.participants, ID: data.roomID });
		});

		return () => {
			if (!socket) return;
			socket.off('create-room');
			socket.off('join-room');
			socket.off('left-room');
		};
	});

	const state: SocketContextState = {
		socket,
		room,
		connected,
		isClientCreator,
		error,
		logs,
	};

	const actions: SocketContextActions = {
		joinRoom: (data) => {
			if (!socket) return;
			socket.emit('join-room', data);
		},
		createRoom: async (data) => {
			if (!socket) return;
			socket.emit('create-room', data);
		},
		getFullEditor: () => {
			if (!socket) return;
			socket.emit('get-full-editor');
		},
		sendFullEditor: (data) => {
			if (!socket) return;
			socket.emit('send-full-editor', data);
		},
		sendHTMLEditor: (data) => {
			if (!socket) return;
			socket.emit('send-html-editor', data);
		},
		sendCSSEditor: (data) => {
			if (!socket) return;
			socket.emit('send-css-editor', data);
		},
		sendJSEditor: (data) => {
			if (!socket) return;
			socket.emit('send-js-editor', data);
		},
	};

	const value: SocketContext = {
		state,
		actions,
	};

	return (
		<SocketContext.Provider value={value}>
			{children}
		</SocketContext.Provider>
	);
};

export type { ClientInitialRequest };
export { useSocketContext };
export default SocketProvider;
