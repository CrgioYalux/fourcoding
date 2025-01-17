import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	define: {
		'process.env': {
			PORT: process.env.PORT ?? '4000',
			URL: process.env.URL ?? 'localhost',
		},
	},
});
