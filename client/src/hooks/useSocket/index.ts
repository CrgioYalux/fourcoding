import io, { Socket } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';

type useSocketState = {
    socket: Socket | null,
    connected: boolean,
    error: boolean,
    logs: string[],
}

const SocketConnectionEvent = {
    connection: {
        init: 'connect',
        end: 'disconnect',
        error: 'connection-error',
        success: 'connection-success'
    }
} as const;

function useSocket(url: string, path: string, queryKey: string, queryValue: any): useSocketState {
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const socketConnection = io(url, {
            transports: ['polling', 'websocket', 'flashsocket'],
            path: path,
            query: {
                [queryKey]: JSON.stringify(queryValue),
            },
        });

        socketRef.current = socketConnection;

        return () => {
            if (!socketRef.current) return;
            socketRef.current.close();
        };
    }, []);

    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.on(SocketConnectionEvent.connection.init, () => {
            setConnected(true);
            setError(false);
        });

        return () => {
            if (!socketRef.current) return;
            socketRef.current.off(SocketConnectionEvent.connection.init);
        };
    });

    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.on(SocketConnectionEvent.connection.success, (data) => {
            setConnected(true);
            setError(false);

            const expected = data as { msgs: string[] };
            //console.log({ expected });
            if (!expected || !expected.msgs || expected.msgs.length === 0) return;

            setLogs((prev) => [...prev, ...expected.msgs]);
        });

        return () => {
            if (!socketRef.current) return;
            socketRef.current.off(SocketConnectionEvent.connection.success);
        };
    });

    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.on(SocketConnectionEvent.connection.error, (data) => {

            setConnected(false);
            setError(true);

            const expected = data as { msgs: string[] };
            if (!expected || !expected.msgs || expected.msgs.length === 0) return;

            setLogs((prev) => [...prev, ...expected.msgs]);
        });

        return () => {
            if (!socketRef.current) return;
            socketRef.current.off(SocketConnectionEvent.connection.error);
        };
    });

    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.on(SocketConnectionEvent.connection.end, (reason) => {

            setConnected(false);
            setError(false);

            if (reason) {
                setLogs((prev) => [...prev, reason]);
            };

            socketRef.current = null
        });

        return () => {
            if (!socketRef.current) return;
            socketRef.current.off(SocketConnectionEvent.connection.end);
        };
    });

    return { socket: socketRef.current, connected, error, logs };
}

export { SocketConnectionEvent };
export default useSocket;
