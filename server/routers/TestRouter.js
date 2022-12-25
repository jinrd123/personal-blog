const express = require("express");
const router = express.Router();
const {db, genid} = require("../db/DbUtils.js");

/*
    此路由接口暂时为了测试db与genid有效性：无问题
*/
router.get("/test", async (req, res) => {
    let out = await db.async.all("select * from `admin`", []);
    res.send({
        id: genid.NextId(),
        out
    });
})

module.exports = router;