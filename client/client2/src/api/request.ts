import axios from "axios";

const requests = axios.create({
    baseURL:"http://localhost:8080",
});

requests.interceptors.request.use((config) => {
    return config;
})

requests.interceptors.response.use((res)=>{
    return res;
},(error)=>{
    return Promise.reject(new Error('faile'));
});

export default requests;