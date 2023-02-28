import { createContext, useContext } from "react";
import { useTheme } from "../../hooks/useTheme";
import type { Theme } from "../../hooks/useTheme/utils";

interface ClientOptionsContext {
    switchTheme: () => void;
    theme: Theme;
}

const ClientOptionsContext = createContext<ClientOptionsContext>({
    switchTheme: () => {},
    theme: 'dark',
});

export const useClientOptions = () => useContext<ClientOptionsContext>(ClientOptionsContext);

interface ClientOptionsProviderProps {
    children: React.ReactNode;
};

export const ClientOptionsProvider: React.FC<ClientOptionsProviderProps> = ({ children }) => {
    const [theme, switchTheme] = useTheme();

    const value: ClientOptionsContext = {
        theme,
        switchTheme,
    };

    return (
        <ClientOptionsContext.Provider value={value}>
            {children}
        </ClientOptionsContext.Provider>
    );
};

