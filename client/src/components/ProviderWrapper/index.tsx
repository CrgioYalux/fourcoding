import SocketProvider from "../../providers/Socket";
import type { ClientInitialRequest } from '../../providers/Socket';

const url: string = 'http://127.0.0.1:4000';
const path: string = '/socket/';
const clientInitialRequest: ClientInitialRequest = {
    username: 'azul',
    type: 'create-room',
};

interface ProviderWrapperProps {
    children: React.ReactNode;
}

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => {
    return (
        <SocketProvider url={url} path={path} clientInitialRequest={clientInitialRequest}>
            {children}
        </SocketProvider>
    );
};

export default ProviderWrapper;
