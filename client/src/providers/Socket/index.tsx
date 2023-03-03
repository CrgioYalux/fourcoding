import { createContext, useContext, useState } from "react";
import useSocket from "../../hooks/useSocket";

import type { Socket } from 'socket.io-client';

interface SocketContext {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContext>({
    socket: null
});

const useSocketContext = () => useContext<SocketContext>(SocketContext);

type SocketQueryLogin = {
    roomID?: string;
    username?: string;
    password?: string;
    type: 'create-room' | 'join-room' | 'update-room';
}

interface SocketProviderProps {
    children: React.ReactNode;
    url: string;
    login: SocketQueryLogin
};

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

const SocketProvider: React.FC<SocketProviderProps> = ({ children, url, login }) => {
    const [socket, socketID] = useSocket(url, JSON.stringify(login));
    const [lastMsgs, setLastMsgs] = useState<string[]>([]);

    socket?.on(SocketEvent.connection.success, (data) => {
        const { roomID } = data as { roomID: string };
        
        console.log(SocketEvent.connection.success);
        console.log({ roomID });
        // should have a higher context to provide a setRoomID so I could call it here
    });

    socket?.on(SocketEvent.connection.error, (data) => {
        const { msgs } = data as { msgs: string[] };
 
        console.log(SocketEvent.connection.error);
        console.log({ msgs });

        setLastMsgs((prev) => [...prev, ...msgs]);
    });


    const value: SocketContext = {
        socket
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export type { SocketQueryLogin };
export { useSocketContext };
export default SocketProvider;
