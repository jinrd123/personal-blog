const express = require("express");
const multer = require("multer");
const path = require("path");
const { db } = require("./db/DbUtils");
const app = express();
const port = 80;

/*
    配置跨域
*/
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method == "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
    else next();
});

/*
    json参数解析
*/
app.use(express.json());

/*
    允许任何接口进行文件上传
*/
const update = multer({
    dest: "./public/upload/temp"
})
app.use(update.any())
app.use(express.static(path.join(__dirname, "public")));

/*
    类全局中间件，给需要登录权限的接口（/_token/...）添加权限验证逻辑
*/
const ADMIN_TOKEN_PATH = "/_token";
app.all("*", async (req, res, next) => {
    if(req.path.indexOf(ADMIN_TOKEN_PATH) > -1) { // 对于有权限要求的接口
        let { token } = req.headers; // 请求头中拿到token字段
        
        let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?";
        let adminResult = await db.async.all(admin_token_sql, [token]);
        if(adminResult.err !== null || adminResult.rows.length === 0) {
            res.send({
                code: 403,
                msg: "请先登录"
            })
            return;
        }else {
            next();
        }
    }else {
        next();
    }
})

app.use("/test", require("./routers/TestRouter"));
app.use("/admin", require("./routers/AdminRouter"));
app.use("/category", require("./routers/CategoryRouter"));
app.use("/blog", require("./routers/BlogRouter"));
app.use("/upload", require("./routers/UploadRouter"));

app.get("/", (req, res) => {
    res.send("hello world");
})

app.listen(port, () => {
    console.log(`启动成功：http://localhost:${port}`);
})