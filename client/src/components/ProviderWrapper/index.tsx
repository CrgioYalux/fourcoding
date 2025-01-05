import SocketProvider from '../../providers/Socket';
import { ThemePreferenceProvider } from '../../providers/ThemePreference';

const url = `${import.meta.env.VITE_SOCKET_ENDPOINT}`;
const path: string = '/socket/';

interface ProviderWrapperProps {
	children: React.ReactNode;
}

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => {
	return (
		<ThemePreferenceProvider>
			<SocketProvider url={url} path={path}>
				{children}
			</SocketProvider>
		</ThemePreferenceProvider>
	);
};

export default ProviderWrapper;
