import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from "pinia"
import { router } from "./router/index.js";
import requests from "./api/request";
let app = createApp(App);
app.use(createPinia());
app.use(router);
app.provide("requests", requests);
app.mount('#app')
