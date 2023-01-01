import axios from "axios";
import { AdminStore } from "../stores/AdminStore.js";
const adminStore = AdminStore();

const requests = axios.create({
    baseURL:"http://localhost:8080",
});

requests.interceptors.request.use((config) => {
    config.headers.token = adminStore.token;
    return config;
})

requests.interceptors.response.use((res)=>{
    return res;
},(error)=>{
    return Promise.reject(new Error('faile'));
});

export default requests;