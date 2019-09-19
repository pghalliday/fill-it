import 'normalize.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';

import React, {
	Suspense,
} from 'react';
import ReactDOM from 'react-dom';
import {
	I18nextProvider,
} from 'react-i18next';
import i18n from './i18n';
import {
	store,
} from './store';
import {
	App,
} from './App';

async function start() {
	await store.init();
	// Suspense component is required so that the app
	// is suspended while the language file is lazily loaded
	ReactDOM.render(
		<Suspense fallback={<div>Loading...</div>}>
			<I18nextProvider i18n={ i18n }>
				<App store={ store } />
			</I18nextProvider>
		</Suspense>,
		document.getElementById('reactjs-app'),
	);
}

start();