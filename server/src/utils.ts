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

type EditorData = {
    html: string,
    css: string,
    js: string,
};

interface ServerToClientEvents {
    'error'            : (data: {msgs: string[]}) => void;
    'left-room'        : (data: {roomID: string, participants: (string | null)[]}) => void;

    'get-full-editor'  : () => void;

    'join-room'        : (data: {roomID: string, participants: (string | null)[]}) => void;
    'create-room'      : (data: {roomID: string, participants: (string | null)[]}) => void;

    'send-full-editor' : (data: EditorData) => void;
    'send-html-editor' : (data: Pick<EditorData, 'html'>) => void;
    'send-css-editor'  : (data: Pick<EditorData, 'css'>) => void;
    'send-js-editor'   : (data: Pick<EditorData, 'js'>) => void;
};

interface ClientToServerEvents {
    'connect'          : (callback: (socket: Socket) => void) => void;
    'disconnect'       : () => void;

    'join-room'        : (data: Partial<Omit<ClientInitialRequest, 'roomID'>> & Pick<ClientInitialRequest, 'roomID'>) => void;
    'create-room'      : (data: Omit<Partial<ClientInitialRequest>, 'roomID'>) => void;

    'get-full-editor'  : () => void;

    'send-full-editor' : (data: EditorData) => void;
    'send-html-editor' : (data: Pick<EditorData, 'html'>) => void;
    'send-css-editor'  : (data: Pick<EditorData, 'css'>) => void;
    'send-js-editor'   : (data: Pick<EditorData, 'js'>) => void;
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
