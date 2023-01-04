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

## 用pinia创建一个仓库用来保存管理员登录信息

`stores/AdminStore.js`：

其实就是用pinia提供的`defineStore`方法创建一个AdminStore，这是一个函数

~~~js
import { defineStore } from "pinia"

export const AdminStore = defineStore("admin", {
    state: () => {
        return {
            id: 0,
            account: "",
            token: "",
        }
    },
    actions: {},
    getters: {},
})
~~~

在组件中调用这个函数就可以获得仓库实例，从而访问仓库中的属性：

`Login.vue`：

~~~js
import { AdminStore } from "../../../client/src/stores/AdminStore";

const adminStore = AdminStore();
~~~

封装axios时在响应拦截器中原本是返回了`res.data`的，相当于只要我们服务端返回的数据，但是这样一修改axios返回的数据的结构，ts项目就会报错，因为axios返回的数据是由接口进行数据类型限制的，所以我又改成直接返回`res`了，这样我们访问服务端返回的数据还是得`res.data`（axios的响应拦截器接收的`res`其实是对服务端返回的数据的一个包装，`res.data`才是服务端返回的那个对象，当然我们服务端返回的那个对象里一般有`code` `data`等字段，所以以后我们拿到axios的返回结果`res`，要想拿到真实的服务端数据就得`res.data.data`）

## naive-ui使用全局api实现message提示信息

`main.js`：

~~~js
import { injectKeyMessage } from './context/context';
const { message, notification, dialog, loadingBar } = createDiscreteApi(['message', 'dialog', 'notification'])
app.provide(injectKeyMessage, message);
~~~

这里我们想把`message`这个玩意通过`app.provide`做一个全局提供，但是发现key如果为简单的一个字符串，子组件中`inject`拿到`message`使用（访问message对象的一些方法）时会报错，因为`provide`时没s指明`message`的类型，访问一些未知的属性，所以报类型错误。

解决方案：

![img](./image/p_i.png)

![img](./image/p-i1.png)

创建了`src/context/context.ts`文件夹，用于存放provide变量时的key（Symbol类型的变量）

`Login.vue`：

~~~js
const message = inject(injectKeyMessage);

/*
	登录回调
*/
const login = async () => {
    let result = await reqLogin(admin);
    if(result.data.code === 200) {
        adminStore.token = result.data.data.token;
        adminStore.account = result.data.data.account;
        adminStore.token = result.data.data.token;
        message.info("登录成功");
    } else {
        message.error("登录失败");
    }
}
~~~

## 记住密码功能

借助本地存储即可

## 登录后路由转跳 && 拿到pinia仓库

`Login.vue`：

~~~js
import { useRouter, useRoute } from "vue-router";
const router = useRouter();

...

router.push("/dashboard");
~~~

`Dashboard.vue`：

~~~js
import { AdminStore } from "../../stores/AdminStore";
const adminStore = AdminStore();
~~~

# 后台框架搭建

左部为导航栏，通过遍历`menus`数组得到，右侧展示路由组件`Article.vue`或`Category.vue`

## Dashboard页面路由切换

实现路由切换函数`toPage`

在`Dashboard`组件中，我们建立了一个`pageTag`变量来标识当前左侧导航栏哪一个被选中，但是我们在刷新页面时，`pageTag`会被初始化为初始值，但是页面刷新路由并没有改变，所以导致左侧选中的（高亮的）导航与真正的路由展示不匹配，所以要在`pageTag`改变时更改路由，即`watch`监视`pageTag`，回调中进行路由转跳（路由修改）。

这样就形成一个闭环：点击左侧导航栏触发`toPage`函数：在路由转跳的同时修改`pageTag`，即左侧导航栏展示高亮与路由同步；当页面刷新时，`pageTag`会改变，但是路由没有随之改变，所以`watch`监听`pageTag`同步改变路由。

## Category组件基本数据展示

## 修改点击退出时路由无法正常转跳的bug

watch的逻辑不完善所导致！

# Category组件的搭建

点击左上角进行添加分类的基本结构搭建

## 给请求头添加token字段

添加分类的`category/_token/add`接口需要请求头携带`token`字段，所以我想在请求拦截器中自动读取`pinia`仓库中的`token`给请求头添加上，但是频频因为ts类型检测出错：1. `axios`的封装文件`request.js`中引入`pinia`仓库模块的时候报错，发现两者文件后缀必须统一（都是`.ts`或者都是`.js`） 2. 如果`axios`的封装文件`request`是`.ts`文件，那么请求拦截器里给`config.header`添加字段就会报错，因为`config.header`的类型声明中没有这个字段...应该是可以处理，但是我没弄成。

目前的解决方案就是把`axios`封装文件和`pinia`仓库文件`AdminStore`都改成`.js`文件。=。=

## 完成添加分类的功能

add函数：携带token添加完分类之后，重新请求分类数据即可

## 完成删除功能

把删除逻辑放到一个警告框里

## 完成修改分类名称功能

这里确定了一件事就是，如果后端接口拿请求的数据是从`req.body`里面取的话，也就是后端那里：`req.body`即为请求传来的数据对象，那么我们前端请求时通过axios配置对象的形式发请求，`axios({url:...,method:...,data:...})`，那么对应的配置对象里的`data`就是一个对象，对应`req.body`。

# Article组件开发

## 基本结构搭建

## 把富文本编辑器封装成一个单独的组件

基本的东西（富文本的结构与逻辑）就是复制粘贴来的，这里记录一下给富文本组件（自定义组件）使用`v-model`，让`Article`组件获得`RichTextEditor`组件的内容（富文本编辑器会把编辑区的文本转化成html文档，对应`valueHtml.value`变量）

`Article`组件中：

~~~html
<rich-text-editor v-model="addArticle.content"></rich-text-editor>
~~~

给富文本组件`v-model`一个值

`RichTextEditor`组件中：

~~~js
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

...

emit("update:modelValue", valueHtml.value);
~~~

* 通过`defineProps`接收父组件传来的值，v-model传来的默认用`modelValue`变量接收
* 通过`defineEmits`定义组件的自定义事件，引起v-model的自定义事件默认为`update:modelValue`

网文总结：

v-model 在Vue里面是一个语法糖，数据的双向绑定，本质上还是通过 自定义标签的 attribute 传递和接受；

在自定义标签中注册 `v-model:attriButeName="value" `, 会拆分为两个属性

`:attributeName="value"` 和 `@update:attributeName="value=$event"` ；

**所以只需要在相应组件中（自定义组件中）接受 attributeName 数据和调用 update:attributeName 方法，就可以实现自定义组件的v-model；**

bug完善：

上面的逻辑确实完成了富文本编辑器中文本修改时同步修改Article组件中的content属性，但是因为富文本编辑器中的`modelValue`接收到的Article组件的文章内容在一开始并没有给富文本编辑器，所以我们让富文本编辑器绑定的`valueHtml`属性用`modelValue`进行初始化：

~~~js
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});
const valueHtml = ref(props.modelValue);
~~~

这样就实现了文章内容与富文本编辑器的完全双向绑定。

## 富文本编辑器配置图片上传

富文本编辑器中上传图片，原理就是我们把一个图片上传到服务器，然后对应的富文本编辑器中生成的html字符串中产生一个<img>标签，`src`属性指向服务器上的图片地址

~~~ts
const server_url = inject("server_url");
/*
	下面因为对editorConfig添加属性，ts会报错，所以提前定义一个接口
*/
interface editorConfigInterface {
  placeholder: string;
  MENU_CONF: Object;
}
const editorConfig: editorConfigInterface = {
  placeholder: "请输入内容...",
  MENU_CONF: {},
};
editorConfig.MENU_CONF["uploadImage"] = {
  base64LimitSize: 10 * 1024, // 小体积图片转base64而不进行上传
  server: server_url + "/upload/rich_editor_upload", // 配置上传的服务端地址
};
~~~

但是经过上面的配置，图片不能正常显式，因为生成的<img>的`src`缺少了服务器地址（只有上传接口...）

~~~typescript
editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc: (src:string) => {
        if(src.indexOf("http") !== 0) {
            return `${server_url}${src}`;
        }
    }
}
~~~

`parseImageSrc`就相当于生成<img>的`src`前的拦截器函数，函数逻辑：如果`src`里没有包含`http`（服务器地址），就补上。

到这里就可以实现富文本编辑器正常的上传图片了。

## 添加文章页面`select`组件获取服务器数据正常展示

plus：<n-select>组件`v-model`绑定的数据初始值应为`null`才能正常显式`placeholder`设置的内容。

## 增加文章列表部分

获取服务器数据后遍历展示，但有一个问题就是遍历展示时文章内容经过富文本编辑器的处理已经成html格式的字符串了，所以这里没有直接使用`{{blog.content}}`插值语法，而是使用了`<div v-html="blog.content"></div>`代替，这样文章列表里展示的文章内容也是文章真实的样子了。

## 设置文章列表多行文本溢出样式

## 文章创建时间格式化展示

首先服务端返回的创建时间是一个时间戳，服务端通过`Date`对象的`getTime`方法所得（`new Date().getTime()`），然后我们客户端对其进行格式化：

~~~js
const fomatTime = (timeStamp) => {
  /*
  	借助Date对象的三个方法分别获取年、月、日
  		1. date.getFullYear()
  		2. date.getMonth()
  		3. date.getDate()
  */
  let date = new Date(timeStamp);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
~~~

## 请求文章列表时添加分页相关参数

首先修改`reqBlogList`，添加分页相关的参数。请求接口有四个query参数，有两个分页相关参数`page`与`pageSize`，还有两个参数：`categoryId`分类相关 && `keyword`关键字相关。

在不同场景下我们只需要用到相关的参数即可，所以这里涉及一个ts传参如何让一个属性成为可选属性（一个属性可传可不传）的写法：

在可选属性后加`?`

~~~typescript
interface Person {
  uuid: string;
  pet?: Animal;
}
~~~

 `pet?: Animal;` 写法就是 `pet: Animal | undefined;` 的简写。

后端的`/blog/search`接口，从`req`从获取`query`参数（`req.query`），如果我们前端使用`axios(配置对象)`的请求方式，并且不想在`url`中传递`query`参数（因为这里我们不能确定某些query参数是否存在），我们就要配置`params`属性为query参数对象，这样后端同样可以通过`req.query`来获取到query参数对象（其实就是前端axios请求的params配置项）

## 更新文章功能实现

~~~typescript
const updateArticle = reactive({
  id: 0,
  categoryId: null,
  title: "",
  content: "",
});

const tabValue = ref("list"); // n-tabs展示部分对应的标识变量
const toUpdate = async (blog) => {
  updateArticle.id = blog.id;
  updateArticle.categoryId = blog.category_id;
  updateArticle.title = blog.title;
  let result = await reqBlogDetail(blog.id);
  let completeContent = result.data.rows[0].content;
  updateArticle.content = completeContent;
  tabValue.value = "update";
};

const update = async () => {
  let result = await reqUpdateArticle(updateArticle);
  if(result.data.code === 200) {
    articleListInit();
    message.info("修改成功~");
    tabValue.value = "list";
  }else {
    message.error(result.data.msg)
  }
}
~~~

上面代码根本不用仔细看，其实完成这个业务逻辑总结下来还是一样：

1. 创建一个`reactive`对象与模板上的数据进行绑定
2. 发请求时传递这个对象的信息，数据更新后及时请求新的数据进行展示
3. 用js修改一些页面转跳以及提示的相关逻辑

就是很普通的业务套路罢了~

## 实现删除文章功能

# 首页开发

## 头部导航搭建

中间的分类按钮用了naive-ui的<n-popselect>组件，和`select`类型的组件完全相似，`v-model`绑定一个`value`值，选择时展示`label`值。

这里获取<n-popselect>`options`对象的方式与`Article`组件获取<n-select>配置对象的逻辑完全一样（用`map`函数对服务端数据进行简单处理，得到组件配置对象期望的结构），直接粘贴过来的。

然后上方导航栏的分类选项后面我们希望展示当前分类，这里用到一个`find`函数即可（根据id找到对应的分类名）。

配置一些路由转跳...没啥营养的业务逻辑

## 中间文章列表的展示

完全就是从`Article`组件中拿来的模板与逻辑，所以这里留个坑，可以封装成一个文章列表组件