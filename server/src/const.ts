import path from 'path';

import type { CorsOptions } from 'cors';

const CORS: CorsOptions = {
    origin: '*',
};

const PATH_TO_BUILD: string =
    process.env.NODE_ENV === 'dev'
        ? path.join(__dirname, '..', '..', 'client', 'dist')
        : path.join(__dirname, '..', '..', '..', 'client', 'dist');

const CONFIG = {
    CORS,
    PATH_TO_BUILD
};

export { CONFIG };
