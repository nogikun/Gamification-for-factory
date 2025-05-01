import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// redux
import { Provider } from 'react-redux';
import { store } from './redux/store';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Root element が見つかりません'); // Root elementが見つからない場合のエラーメッセージ
}

const root = createRoot(container);
root.render(
	<React.StrictMode>
        <Provider store={store}> {/* ReduxのProviderでラップ */}
            <App />
        </Provider>
	</React.StrictMode>
);
