/*
 * @Date: 2022-10-20 17:34:55
 * @LastEditors: xuanyi_ge xuanyige87@gmail.com
 * @LastEditTime: 2022-10-20 20:34:58
 * @FilePath: \NodeReactProject\src\utils.js
 */
const {db:dbConfig} = require("../database.config");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const SECRETKEY = "gexuanyi";
module.exports = {
  //创建唯一的用户ID
  createUniqueUid: function createUniqueUid() {
    let uid = (v4() + "").replace(/\-/g, "");
    return uid;
  },
  verifyToken:(req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['token'];
    if (token) {
      jwt.verify(token, SECRETKEY, (err, decode) => {
        if (err) {
          res.send({
            message: "无效token",
            status:400,
          })
        } else {
          req.user = decode;
          next();
        }
      })
    } else {
      if (!req.body.uAccount && !req.body.password) {
        res.send({
          message: "找不到token",
          status:403
        })
      } else {
        next();
      }
    }
  },
  createUniqueAccount() {
    const precision = parseInt(Math.random() * 99) + 1;
    const rawPre = (Date.now() - new Date(1624206802955).getTime()) / precision;
    const preNumber = Number(rawPre.toFixed()) * precision;
    const randam = Math.floor(Math.random() * precision);
    return preNumber + randam;
  },
  //连接数据库
  connectDb:function connectDb() {
    const mysql = require("mysql");
    let conn = mysql.createConnection(dbConfig);
    conn.connect((err) => {
      if (err) throw err
      console.log('数据库连接成功');
    })
    return conn;
  },
  //关闭数据库
  closeDB(conn) {
    conn.end((err) => {
      if (err) throw err
      console.log('数据库断开连接');
    })
  },
  insertValue(conn, tableName, field,value) {
    const res = conn.query(`insert into ${tableName}${field} values${value}`);
    return res;
  },
  selectValue(conn,clomun,table,condition="1=1") {
    const sql = `select ${clomun} from ${table} where ${condition}`;
    return new Promise((resolve,reject) => {
      conn.query(sql, (err,res) => {
        if (err) reject(err);
        resolve(res[0]);
      });
    })
  },
  cryptoPassword(password) {
    const result = crypto.createHmac("md5", SECRETKEY).update(password).digest("hex");
    return result;
  }
}