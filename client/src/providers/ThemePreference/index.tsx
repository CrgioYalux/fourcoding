import { createContext, useContext } from 'react';
import { useTheme } from '../../hooks/useTheme';
import type { Theme } from '../../hooks/useTheme/utils';

interface ThemePreferenceContext {
	switchTheme: () => void;
	theme: Theme;
}

const ThemePreferenceContext = createContext<ThemePreferenceContext>({
	switchTheme: () => {},
	theme: 'dark',
});

export const useThemePreference = () =>
	useContext<ThemePreferenceContext>(ThemePreferenceContext);

interface ThemePreferenceProviderProps {
	children: React.ReactNode;
}

export const ThemePreferenceProvider: React.FC<
	ThemePreferenceProviderProps
> = ({ children }) => {
	const [theme, switchTheme] = useTheme();

	const value: ThemePreferenceContext = {
		theme,
		switchTheme,
	};

	return (
		<ThemePreferenceContext.Provider value={value}>
			{children}
		</ThemePreferenceContext.Provider>
	);
};
