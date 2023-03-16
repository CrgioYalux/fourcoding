import SocketProvider from "../../providers/Socket";

const url: string = 'http://127.0.0.1:4000';
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
