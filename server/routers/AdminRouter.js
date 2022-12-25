const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { db, genid } = require("../db/DbUtils.js");

/*
    管理员登录接口
*/
router.post("/login", async (req, res) => {
    /*
        拿到前端请求数据，用其查询数据库
    */
    let { account, password } = req.body;
    let { err, rows } = await db.async.all("select * from `admin` where `account` = ? and `password` = ?", [account, password]);

    if(err === null && rows.length > 0) { // 查询没有错误 && 查询到对应账户
        let login_token = uuidv4();
        let update_token_sql = "update `admin` set `token` = ? where `id` = ?";

        // 更新数据库对应账号的token
        await db.async.run(update_token_sql, [login_token, rows[0].id]);

        let admin_info = rows[0];
        admin_info.token = login_token;
        admin_info.password = "";

        res.send({
            code: 200,
            msg: "登陆成功",
            data: admin_info,
        })
    } else {
        res.send({
            code: 500,
            msg: "登陆失败"
        })
    }
})

module.exports = router;