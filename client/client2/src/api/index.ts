import requests from "./request";

export const reqTest = () => requests.get("/test/test");

export const reqLogin = async (data: { account: String, password: String}) => {
    let result = await requests({url: "/admin/login", data, method: "post"});
    return result;
}
