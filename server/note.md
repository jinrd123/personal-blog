# 项目搭建

1. `npm init -y`
2. `npm i express multer splite3 uuid`

3. `/utils/SnowFlake.js`：id生成工具（开源项目）

4. app.js进行基础配置

# 链接数据库&&使用SnowFlake生产ID

`db`文件夹下创建sqlite3数据库`blog.sqlite3`，建立：

* admin管理员表
* blog博文表
* category分类表

`/db/DbUtils.js`用于对外暴露数据库对象`db`以及id生成器对象`genid`

创建一个简单路由`/routers/TestRouter.js`，同时测试db与genid有效性

# 封装db.all与db.run方法

/db/DbUtils.js：

~~~js
...
/*
    封装db.all&db.run方法防止db.all&db.run回调函数体中调用db.all | db.run产生的地狱回调问题,外部使用我们封装的这两个方法时就可以借助async—await（或者then）
*/
db.async = {};

db.async.all = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            resolve({err, rows});
        })
    })
}

db.async.run = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            resolve({err, rows});
        })
    })
}

...
~~~

# 管理员登录接口的实现

接口逻辑，使用前端发送来的账号密码对数据库进行查询，若有匹配项，则利用uuid生成一个token值并更新数据库，同时返回给前端。

# 分类表增删改查接口实现

详见`/routers/CategoryRouter.js`。

# 博客表增删改查接口实现

详见`/routers/BlogRouter.js`。

# 文件上传接口

详见`/routers/UploadRouter.js`。

把上传的文件存放到`/public/upload`文件夹中，并且返回给前端文件url数组，通过url可以访问服务端文件资源（app.js中使用`express.static`中间件托管`public`文件夹）

# 增加验证登录逻辑

每个以`/_token`开头的接口都是需要登录之后才有权限进行操作的接口，我们使用`app.all`（类似于全局中间件）进行请求捕获，对于`/_token`开头的请求，尝试获取`header`（请求头）中的`token`字段，并使用`token`查询`admin`管理员表，如果查询到了数据，就说明已经登录，否则就是没有登陆。

（每次用户调用登录接口登录一个管理员账号时，对应账号的token字段就会被更新一个值，并且返回给客户端，客户端在请求头中添加token字段携带这个值即可）