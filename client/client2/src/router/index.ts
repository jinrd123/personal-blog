import { createRouter, createWebHashHistory } from "vue-router";
let routes = [
    { path: "/", redirect: "/homepage" },
    { path: "/login", component: () => import("../views/Login.vue") },
    {
        path: "/dashboard", component: () => import("../views/dashboard/Dashboard.vue"), children: [
            { path: "/dashboard/category", component: () => import("../views/dashboard/Category.vue") },
            { path: "/dashboard/article", component: () => import("../views/dashboard/Article.vue") },
        ],
        redirect: "/dashboard/article"
    },
    { path: "/homepage", component: () => import("../views/HomePage.vue") },
    { path: "/detail", component: () => import("../views/Detail.vue") },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export { router, routes };