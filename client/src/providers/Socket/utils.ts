type ClientInitialRequestType = 'create-room' | 'join-room';

type ClientInitialRequest = {
    roomID: string,
    username: string,
    password: string,
    type: ClientInitialRequestType,
};

interface CustomClientToServerEvents {
    'create-room'     : (data: Partial<Omit<ClientInitialRequest, 'type'>>) => void;
    'join-room'       : (data: Partial<Omit<ClientInitialRequest, 'type' | 'roomID'>> & Pick<ClientInitialRequest, 'roomID'>) => void;

    'send-full-editor': (data: {js: string, html: string, css: string}) => void;
    'send-js-editor'  : (data: {js: string}) => void;
    'send-html-editor': (data: {html: string}) => void;
    'send-css-editor' : (data: {css: string}) => void;
};

interface CustomServerToClientEvents {
    'create-room'     : (data: {roomID: string, participants: (string | null)[]}) => void;
    'join-room'       : (data: {participants: (string | null)[]}) => void;

    'send-full-editor': (data: {js: string, html: string, css: string}) => void;
    'send-js-editor'  : (data: {js: string}) => void;
    'send-html-editor': (data: {html: string}) => void;
    'send-css-editor' : (data: {css: string}) => void;
    'get-full-editor' : () => void;
};


export type { CustomServerToClientEvents, CustomClientToServerEvents, ClientInitialRequest };
