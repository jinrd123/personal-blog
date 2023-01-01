import { createApp, InjectionKey } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from "pinia"
import { router } from "./router/index.js";
import {createDiscreteApi} from "naive-ui";
import { injectKeyMessage, injectKeyDialog } from './context/context';
const { message, notification, dialog, loadingBar } = createDiscreteApi(['message', 'dialog', 'notification'])
let app = createApp(App);
app.use(createPinia());
app.use(router);
app.provide(injectKeyMessage, message);
app.provide(injectKeyDialog, dialog);
app.provide("server_url", "http://localhost:8080")
app.mount('#app')
