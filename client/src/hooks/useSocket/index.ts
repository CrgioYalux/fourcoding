import io, { Socket } from 'socket.io-client';
import { useState, useEffect } from 'react';

type useSocketState = readonly [ socket: Socket | null, socketID: string ]

function useSocket(url: string, login: any): useSocketState {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [socketID, setSocketID] = useState<string>('');

    useEffect(() => {
        const socketConnection = io(url, {
            transports: ['polling', 'websocket', 'flashsocket'],
            path: '/socket/',
            query: { login },
        });
        setSocket(socketConnection);

        return () => {
            socketConnection.close();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('connect', () => {
            setSocketID(socket.id);
        });
        return () => {
            socket.off('connect');
        };
    });

    return [socket, socketID];
}

export default useSocket;
