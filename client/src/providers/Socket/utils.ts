type OneRequiredRestOptional<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;

type ClientInitialRequest = {
    roomID: string,
    username: string,
    password: string,
};

interface CustomClientToServerEvents {
    'create-room'     : (data: Partial<ClientInitialRequest>) => void;
    'join-room'       : (data: OneRequiredRestOptional<ClientInitialRequest, 'roomID'>) => void;

    'send-full-editor': (data: {js: string, html: string, css: string}) => void;
    'send-js-editor'  : (data: {js: string}) => void;
    'send-html-editor': (data: {html: string}) => void;
    'send-css-editor' : (data: {css: string}) => void;
};

interface CustomServerToClientEvents {
    'create-room'     : (data: {roomID: string, participants: (string | null)[]}) => void;
    'join-room'       : (data: {roomID: string, participants: (string | null)[]}) => void;

    'send-full-editor': (data: {js: string, html: string, css: string}) => void;
    'send-js-editor'  : (data: {js: string}) => void;
    'send-html-editor': (data: {html: string}) => void;
    'send-css-editor' : (data: {css: string}) => void;

    'get-full-editor' : (data: {roomID: string, participants: (string | null)[]}) => void;
};


export type { CustomServerToClientEvents, CustomClientToServerEvents, ClientInitialRequest, OneRequiredRestOptional };
