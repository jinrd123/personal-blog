const express = require("express");
const router = express.Router();
const {db, genid} = require("../db/DbUtils.js");

/*
    此路由接口暂时为了测试db与genid有效性：无问题
*/
router.get("/test", (req, res) => {
    db.all("select * from `admin`", [], (err, rows) => {
        console.log(rows);
    })
    res.send({
        id: genid.NextId()
    });
})

module.exports = router;