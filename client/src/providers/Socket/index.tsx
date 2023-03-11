import { createContext, useContext, useEffect, useState } from "react";
import useSocket from "../../hooks/useSocket";

import type { Socket } from 'socket.io-client';
import type { CustomServerToClientEvents, CustomClientToServerEvents, ClientInitialRequest } from './utils';

type Room = {
    ID: string,
    participants: (string | null)[],
};

interface SocketContext {
    room: Room | null,
    connected: boolean,
    error: boolean,
    logs: string[],
};

const SocketContext = createContext<SocketContext>({
    connected: false,
    logs: [],
    error: false,
    room: null,
});

const useSocketContext = () => useContext<SocketContext>(SocketContext);

interface SocketProviderProps {
    children: React.ReactNode;
    url: string;
    path: string;
    clientInitialRequest: Partial<Omit<ClientInitialRequest, 'type'>> & Pick<ClientInitialRequest, 'type'>; 
};

const SocketProvider: React.FC<SocketProviderProps> = ({ children, url, path, clientInitialRequest }) => {
    const { socket, connected, error, logs } = useSocket<Socket<CustomServerToClientEvents, CustomClientToServerEvents>>(url, path);
    const [room, setRoom] = useState<Room | null>(null);

    useEffect(() => {
        if (!socket) return;
        if (clientInitialRequest.type !== 'join-room') return;
        if (!clientInitialRequest.roomID) return;

        socket.emit('join-room', {
            roomID: clientInitialRequest.roomID,
            username: clientInitialRequest.username,
            password: clientInitialRequest.password
        });

        return () => {
            if (!socket) return;
            socket.off('join-room');
        };
    });

    useEffect(() => {
        if (!socket) return;
        if (clientInitialRequest.type !== 'create-room') return;
        if (room) return;

        const { type, ...rest } = clientInitialRequest;
        socket.emit('create-room', rest);

        return () => {
            if (!socket) return;
            socket.off('create-room');
        };
    });

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
            if (!clientInitialRequest.roomID) return;
            setRoom({ participants: data.participants, ID: clientInitialRequest.roomID });
        });

        return () => {
            if (!socket) return;
            socket.off('join-room');
        };
    });

    const value: SocketContext = {
        room,
        connected,
        error,
        logs,
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
