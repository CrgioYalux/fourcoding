import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

interface ServerToClientEvents {
    'connection-success': () => void;
    'connection-error': (data: {msgs: string[]}) => void;
    'error': (data: {msgs: string[]}) => void;
};

interface ClientToServerEvents {
};

type useSocketState<T> = {
    socket: Socket<ServerToClientEvents, ClientToServerEvents> & T | null,
    connected: boolean,
    error: boolean,
    logs: string[],
};

function useSocket<T extends Socket>(url: string, path: string, queryKey?: string, queryValue?: any): useSocketState<T> {
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> & T | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const socketConnection = io(url, {
            autoConnect: true,
            transports: ['polling', 'websocket', 'flashsocket'],
            path: path,
            query: (queryKey) ? {
                [queryKey]: JSON.stringify(queryValue),
            } : undefined,
        });

        socketRef.current = socketConnection as Socket<ServerToClientEvents, ClientToServerEvents> & T;

        return () => {
            if (!socketRef.current) return;
            socketRef.current.close();
        };
    }, []);

    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.on('connect', () => {
            setConnected(true);
            setError(false);
        });

        socketRef.current.on('error', (data) => {
            setLogs((prev) => [...prev, ...data.msgs]);
        });

        socketRef.current.on('connect_error', (error) => {
            setConnected(false);
            setError(true);
            setLogs((prev) => [...prev, error.message === 'xhr poll error' ? 'disconnected from server' : error.message]);
        });

        socketRef.current.on('disconnect', (reason) => {
            setConnected(false);
            setError(false);
            setLogs((prev) => [...prev, reason]);

            // socketRef.current = null;
        });

        return () => {
            if (!socketRef.current) return;
            socketRef.current.off('connect');
            socketRef.current.off('error');
            socketRef.current.off('connect_error');
            socketRef.current.off('disconnect');
        };
    });

    return { socket: socketRef.current, connected, error, logs };
}

export default useSocket;
