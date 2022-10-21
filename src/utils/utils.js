/*
 * @Date: 2022-10-21 09:06:41
 * @LastEditors: xuanyi_ge xuanyige87@gmail.com
 * @LastEditTime: 2022-10-21 09:07:08
 * @FilePath: \NodeReactProject-BE\src\utils\utils.js
 */
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
  cryptoPassword(password) {
    const result = crypto.createHmac("md5", SECRETKEY).update(password).digest("hex");
    return result;
  }
}