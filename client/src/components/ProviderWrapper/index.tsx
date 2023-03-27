import SocketProvider from "../../providers/Socket";

const url = `${process.env.URL}`;
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
