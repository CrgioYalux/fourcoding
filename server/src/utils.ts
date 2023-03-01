import type { CorsOptions } from 'cors';

type OperationResult<T> = {
    error: boolean,
    msgs: string[],
    out?: T,
}

const corsOptions: CorsOptions = {
    origin: false,
};

export type { OperationResult };
export { corsOptions };
