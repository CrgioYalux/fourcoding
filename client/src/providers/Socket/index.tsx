import { createContext, useContext, useEffect, useState } from "react";
import useSocket, { SocketConnectionEvent } from "../../hooks/useSocket";

type Room = {
    ID: string,
    participants: (string | null)[],
}

interface SocketContext {
    room: Room | null,
    connected: boolean,
    error: boolean,
    logs: string[],
}

const SocketContext = createContext<SocketContext>({
    connected: false,
    logs: [],
    error: false,
    room: null,
});

const useSocketContext = () => useContext<SocketContext>(SocketContext);

type ClientInitialRequest = {
    roomID?: string;
    username?: string;
    password?: string;
    type: 'create-room' | 'join-room';
}

interface SocketProviderProps {
    children: React.ReactNode;
    url: string;
    path: string;
    clientInitialRequest: ClientInitialRequest; 
};

const SocketProvider: React.FC<SocketProviderProps> = ({ children, url, path, clientInitialRequest }) => {
    const { socket, connected, error, logs } = useSocket(url, path, 'clientInitialRequest', clientInitialRequest);
    const [room, setRoom] = useState<Room | null>(null);

    useEffect(() => {
        if (!socket || clientInitialRequest.type !== 'create-room') return;

        socket.on(SocketConnectionEvent.connection.success, (data) => {
            const expected = data as { roomID: string };
            if (!expected.roomID) return;
            setRoom({ ID: expected.roomID, participants: [] });
        });

        return () => {
            socket.off(SocketConnectionEvent.connection.success);
        };
    });

    useEffect(() => {
        if (!socket || clientInitialRequest.type !== 'join-room') return;

        socket.on(SocketConnectionEvent.connection.success, (data) => {
            const expected = data as Room;
            console.log(expected);
            if (!expected) return;
            setRoom(expected);
        });

        return () => {
            socket.off(SocketConnectionEvent.connection.success);
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
