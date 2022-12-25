/*
    此文件用于引入数据库和雪花id生成器，方便项目其它位置进行引用
*/
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const GenId = require("../utils/SnowFlake");

var db = new sqlite3.Database(path.join(__dirname, "blog.sqlite3"));
const genid = new GenId({WorkerId: 1});

/*
    封装db.all&db.run方法防止db.all&db.run回调函数体中调用db.all | db.run产生的地狱回调问题
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

module.exports = {db, genid};