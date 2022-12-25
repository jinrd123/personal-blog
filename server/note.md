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

