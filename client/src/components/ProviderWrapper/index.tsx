import SocketProvider from "../../providers/Socket";
import type { SocketQueryLogin } from '../../providers/Socket';

const url: string = 'http://127.0.0.1:4000';
const login: SocketQueryLogin = {
    username: 'azul',
    type: 'create-room',
};

interface ProviderWrapperProps {
    children: React.ReactNode;
}

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => {
    return (
        <SocketProvider url={url} login={login}>
            {children}
        </SocketProvider>
    );
};

export default ProviderWrapper;
