import { createContext, useContext, useState, useEffect } from "react";
import useSocket from "../../hooks/useSocket";

import type { Socket } from 'socket.io-client';
import type { CustomServerToClientEvents, CustomClientToServerEvents, ClientInitialRequest, OneRequiredRestOptional } from './utils';

type Room = { ID: string,
    participants: (string | null)[],
};

type SocketContextState = {
    room: Room | null,
    connected: boolean,
    error: boolean,
    logs: string[],
};

type SocketContextActions = {
    joinRoom: (data: OneRequiredRestOptional<ClientInitialRequest, 'roomID'>) => void,
    createRoom: (data: Partial<ClientInitialRequest>) => void,
};

interface SocketContext {
    state: SocketContextState,
    actions: SocketContextActions,
};

const SocketContext = createContext<SocketContext>({
    state: {
        connected: false,
        logs: [],
        error: false,
        room: null,
    },
    actions: {
        joinRoom: () => {},
        createRoom: () => {},
    }
});

const useSocketContext = () => useContext<SocketContext>(SocketContext);


interface SocketProviderProps {
    children: React.ReactNode;
    url: string;
    path: string;
    clientInitialRequest: Partial<ClientInitialRequest>;
};

const SocketProvider: React.FC<SocketProviderProps> = ({ children, url, path, clientInitialRequest }) => {
    const { socket, connected, error, logs } = useSocket<Socket<CustomServerToClientEvents, CustomClientToServerEvents>>(url, path);
    const [room, setRoom] = useState<Room | null>(null);

    useEffect(() => {
        if (!socket) return;

        socket.on('create-room', (data) => {
            setRoom({ participants: data.participants, ID: data.roomID });
        });

        return () => {
            if (!socket) return;
            socket.off('create-room');
        };
    });

    useEffect(() => {
        if (!socket) return;
        
        socket.on('join-room', (data) => {
            setRoom({ participants: data.participants, ID: data.roomID });
        });

        return () => {
            if (!socket) return;
            socket.off('join-room');
        };
    });

    useEffect(() => {
        if (!socket) return;

        socket.on('get-full-editor', (data) => {
            setRoom({ participants: data.participants, ID: data.roomID });
        });

        return () => {
            if (!socket) return;
            socket.off('get-full-editor');
        };
    });

    const state: SocketContextState = {
        room,
        connected,
        error,
        logs,
    };

    const actions: SocketContextActions = {
        joinRoom: (data) => {
            if (!socket) return;
            socket.emit('join-room', data);           
        },
        createRoom: (data) => {
            if (!socket) return;
            socket.emit('create-room', data);           
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
