import SocketProvider from "../../providers/Socket";

const port = process.env.PORT;
const url: string = `localhost:${port}`;
const path: string = '/socket/';

console.log(port);

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
