import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

store.dispatch('init');
createApp(App).use(store).mount('#app');
