const express = require("express");
const path = require("path");
const app = express();
const port = 80;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method == "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
    else next();
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    console.log(`启动成功：http://localhost:${port}`);
})