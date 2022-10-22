/*
 * @Date: 2022-10-21 09:06:41
 * @LastEditors: xuanyi_ge xuanyige87@gmail.com
 * @LastEditTime: 2022-10-21 13:29:40
 * @FilePath: \NodeReactProject-BE\src\utils\utils.js
 */
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const SECRETKEY = "gexuanyi";
const { emailConfig } = require("../../project.config")
const sendEmail = function (to,identifyCode) {
  const emailServer = require('nodemailer');
  const tunnel = emailServer.createTransport(emailConfig);
  tunnel.sendMail({
    from: emailConfig.auth.user,
    subject: '注册验证',
    text: `您的验证码是:${identifyCode},如非本人操作,请忽略`,
    to,
  }, () => {
    if (err) {
      console.error(err);
    }
    else {
      console.log(data);
    }
  })
}
const createUniqueUid = function() {
  let uid = (v4() + "").replace(/\-/g, "");
  return uid;
}
const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['token'];
  if (token) {
    jwt.verify(token, SECRETKEY, (err, decode) => {
      if (err) {
        res.send({
          message: "无效token",
          status: 400,
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
        status: 403
      })
    } else {
      next();
    }
  }
}
const createUniqueAccount = ()=> {
  const precision = parseInt(Math.random() * 99) + 1;
  const rawPre = (Date.now() - new Date(1624206802955).getTime()) / precision;
  const preNumber = Number(rawPre.toFixed()) * precision;
  const randam = Math.floor(Math.random() * precision);
  return preNumber + randam;
}
const cryptoPassword = (password)=> {
  const result = crypto.createHmac("md5", SECRETKEY).update(password).digest("hex");
  return result;
}
module.exports = {
  //创建唯一的用户ID
  createUniqueUid,
  verifyToken,
  createUniqueAccount,
  cryptoPassword,
  sendEmail
}