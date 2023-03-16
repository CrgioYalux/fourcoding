import type { Socket } from 'socket.io';

type OperationResult<T> = {
    error: boolean,
    msgs: string[],
    out?: T,
}

type ClientInitialRequest = {
    username: string,
    password: string,
    roomID: string,
};

interface ServerToClientEvents {
    'error': (data: {msgs: string[]}) => void;

    'get-full-editor': (data: {roomID: string, participants: (string | null)[]}) => void;

    'join-room': (data: {roomID: string, participants: (string | null)[]}) => void;
    'create-room': (data: {roomID: string, participants: (string | null)[]}) => void;

    'send-full-editor': (data: {js: string, html: string, css: string}) => void;
    'send-js-editor': (data: {js: string}) => void;
    'send-html-editor': (data: {html: string}) => void;
    'send-css-editor': (data: {css: string}) => void;
};

interface ClientToServerEvents {
    'connect': (callback: (socket: Socket) => void) => void;
    'disconnect': () => void;

    'join-room': (data: Partial<Omit<ClientInitialRequest, 'roomID'>> & Pick<ClientInitialRequest, 'roomID'>) => void;
    'create-room': (data: Omit<Partial<ClientInitialRequest>, 'roomID'>) => void;

    'send-full-editor': (data: {js: string, html: string, css: string}) => void;
    'send-js-editor': (data: {js: string}) => void;
    'send-html-editor': (data: {html: string}) => void;
    'send-css-editor': (data: {css: string}) => void;
};

interface InterServerEvents {
    'ping': () => void;
};

interface SocketData {
    clientHandshake: Omit<ClientInitialRequest, 'password'> & Pick<Partial<ClientInitialRequest>, 'password'>;
};

export type {
    OperationResult,
    ClientInitialRequest,
    ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents,
    SocketData
};
