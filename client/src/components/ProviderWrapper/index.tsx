import SocketProvider from "../../providers/Socket";

const url = `${import.meta.env.VITE_SOCKET_ENDPOINT}`;
const path: string = '/socket/';

interface ProviderWrapperProps {
    children: React.ReactNode;
}

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => {
    return (
        <SocketProvider url={url} path={path}>
            {children}
        </SocketProvider>
    );
};

export default ProviderWrapper;
