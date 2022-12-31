# 项目创建与模块安装

1. 使用vite构建vue3项目，安装vite

~~~
npm create vite@latest
~~~

2. 安装依赖，启动项目

~~~
npm install && npm run dev
~~~

3. 安装项目开发所需模块

* axios：`npm i axios`
* pinia：`npm i pinia`
* sass：`npm i sass`
* vue-router：`npm i vue-router@4`
* naive-ui：`npm i -D naive-ui` && `npm i -D vfonts`
* wangeditor：`npm i @wangeditor/editor-for-vue@next --save`

# 项目结构搭建

main.js中对开发所需的依赖进行引入

naive-ui组件库暂时使用全局引入，后期可优化为按需引入

配置`@/common/router.js`路由配置文件

## 引入pinia

`main.js`：

~~~js
import { createPinia } from "pinia"
...
app.use(createPinia());
~~~

## 配置项目路由

`@/common/router.js`（路由配置文件）：

~~~js
import { createRouter, createWebHashHistory } from "vue-router";

let routes = [
    { path: "/", component: () => import("../views/Test.vue") },
	...
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export { router, routes };
~~~

`@/main.js`：

~~~js
import { router } from "./common/router";
...
app.use(router);
~~~

## 配置axios

用`e_commerce_platform`的封装方式封装了axios并创建了`api`文件夹管理接口

# 登录页面结构搭建

## 使用naive-ui组件库进行静态搭建

`template`：

~~~html
<template>
    <div class="login-panel">
        /*
        	一个n-card进行布局，就相当于div，但是n-card有很多插槽，还有title之类的属性，可以给card内部的位置灵活插入内容
        */
        <n-card title="管理后台登录">
            /*
            	n-form就是表单，里面是n-from-item，n-from-item里面放置n-input
            	n-form的表单验证规则由rules属性决定，写rules时需要n-form-item的path属性对应具体的n-form-item
            */
            <n-form :rules="rules" :model="admin">
                <n-form-item path="account" label="账号">
                    <n-input v-model:value="admin.account" placeholder="请输入账号" />
                </n-form-item>
                <n-form-item path="password" label="密码">
                    <n-input v-model:value="admin.password" type="password" placeholder="请输入密码" />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-checkbox v-model:checked="admin.rember" label="记住我" />
                <n-button>登录</n-button>
            </template>
        </n-card>
    </div>
</template>
~~~

## provide全局提供封装的axios实例——requests

`main.js`：

~~~js
import requests from "./api/request";

app.provide("requests", requests);
~~~

`Login.vue`：

~~~js
const axios = inject("requests");
~~~

