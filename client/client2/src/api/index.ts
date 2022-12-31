import requests from "./request";

export const reqTest = () => requests.get("/test/test");

export const reqLogin = async (data: { account: String, password: String }) => {
    let result = await requests({ url: "/admin/login", data, method: "post" });
    return result;
}

export const reqCategoryList = async () => {
    let result = await requests({ url: "/category/list", method: "get" });
    return result;
}

export const reqAddCategory = async (newCategory: { name: String }) => {
    let result = await requests({ url: "/category/_token/add", data: newCategory })
    return result;
}