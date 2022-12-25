const express = require("express");
const multer = require("multer");
const app = express();
const port = 8080;

/*
    配置跨域
*/
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "content-type");
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

app.use("/test", require("./routers/TestRouter"));
app.use("/admin", require("./routers/AdminRouter"));

app.get("/", (req, res) => {
    res.send("hello world");
})

app.listen(port, () => {
    console.log(`启动成功：http://localhost:${port}`);
})