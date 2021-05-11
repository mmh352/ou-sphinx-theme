import App from './App.svelte';
import { url } from './store';

const app = new App({
	target: document.querySelector('#app'),
});

url.set(window.location.href);

export default app;
