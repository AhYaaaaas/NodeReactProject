/*
 * @Date: 2022-10-21 09:06:41
 * @LastEditors: xuanyi_ge xuanyige87@gmail.com
 * @LastEditTime: 2022-10-22 23:24:59
 * @FilePath: \NodeReactProject-BE\src\utils\utils.js
 */
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const SECRETKEY = "gexuanyi";
const {
  emailConfig,
  messageMap,
  statusMap
} = require("../../project.config")
const sendEmail = function (to, identifyCode) {
  try {
    const emailServer = require('nodemailer');
    const tunnel = emailServer.createTransport(emailConfig);
    tunnel.sendMail({
      from: emailConfig.auth.user,
      subject: '注册验证',
      text: `您的验证码是:${identifyCode},如非本人操作,请忽略`,
      to,
    })
  } catch (e) {
    return e;
  }
}
const createUniqueUid = function () {
  let uid = (v4() + "").replace(/\-/g, "");
  return uid;
}
const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['token'];
  if (token) {
    jwt.verify(token, SECRETKEY, (err, decode) => {
      if (err) {
        res.send({
          message: messageMap["INVALID_TOKEN"],
          status: statusMap["BAD_REQUEST"],
        })
      } else {
        req.user = decode;
        next();
      }
    })
  } else {
    if (!req.body.uAccount && !req.body.password) {
      res.send({
        message: messageMap["TOKEN_DISAPPEAR"],
        status: statusMap["BAD_REQUEST"]
      })
    } else {
      next();
    }
  }
}
const createUniqueAccount = () => {
  const precision = parseInt(Math.random() * 99) + 1;
  const rawPre = (Date.now() - new Date(1624206802955).getTime()) / precision;
  const preNumber = Number(rawPre.toFixed()) * precision;
  const randam = Math.floor(Math.random() * precision);
  return preNumber + randam;
}
const cryptoPassword = (password) => {
  const result = crypto.createHmac("md5", SECRETKEY).update(password).digest("hex");
  return result;
}
module.exports = {
  createUniqueUid,
  verifyToken,
  createUniqueAccount,
  cryptoPassword,
  sendEmail
}