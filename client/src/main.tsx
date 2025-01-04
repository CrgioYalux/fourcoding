import React from 'react';
import ReactDOM from 'react-dom/client';
import ProviderWrapper from './components/ProviderWrapper';
import App from './components/App';

import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ProviderWrapper>
			<App />
		</ProviderWrapper>
	</React.StrictMode>
);
