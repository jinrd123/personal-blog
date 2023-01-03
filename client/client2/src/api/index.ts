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
    let result = await requests({ url: "/category/_token/add", data: newCategory, method: "post" })
    return result;
}

export const reqDeleteCategory = async (categoryId: number) => {
    let result = await requests({ url: `/category/_token/delete?id=${categoryId}`, method: "delete" });
    return result;
}

export const reqUpdateCategory = async (category: { id: number, name: string }) => {
    let result = await requests({ url: "/category/_token/update", data: category, method: "put" });
    return result;
}

export const reqAddArticle = async (Article: { categoryId: number, title: string, content: string }) => {
    let result = requests({ url: "/blog/_token/add", data: Article, method: "post" });
    return result;
}

export const reqBlogList = async (queryParams: { page: number | undefined, pageSize: number | undefined, categoryId: number | undefined, keyword: string | undefined }) => {
    let result = requests({ url: "/blog/search", method: "get", params: queryParams });
    return result;
}

export const reqBlogDetail = async (id: number) => {
    let result = requests({ url: "/blog/detail", method: "get", params: { id } });
    return result;
}

export const reqUpdateArticle = async (Article: { id: number, title: string, categoryId: number, content: string }) => {
    let result = requests({ url: "/blog/_token/update", method: "put", data: Article });
    return result;
}

export const reqDeleteArticle = async (id: number) => {
    let result = requests({ url: "/blog/_token/delete", method: "delete", params: { id } });
    return result;
}