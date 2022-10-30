/*
 * @Date: 2022-10-21 09:06:41
 * @LastEditors: AhYaaaaas xuanyige87@gmail.com
 * @LastEditTime: 2022-10-30 12:32:08
 * @FilePath: \NodeReactProject-BE\src\utils\utils.js
 */
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const SECRETKEY = "gexuanyi";
const {
  emailConfig,
  messageMap,
  statusMap
} = require("../../project.config");
const { fstat } = require("fs");
//发送验证码邮件
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
//随机创建uid
const createUniqueUid = function () {
  let uid = (v4() + "").replace(/\-/g, "");
  return uid;
}

// 验证token
const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['authorization'];
  if (req.body.uAccount && req.body.password) {
    // 存在账号密码直接进入下一步校验
    console.log("ap 1");
    next();
  } else if (token) {
    // 存在token进行token校验
    jwt.verify(token, SECRETKEY, (err, decode) => {
      // 非法token
      if (err) {
        res.send({
          message: messageMap["INVALID_TOKEN"],
          status: statusMap["BAD_REQUEST"],
        })
      } else {
        // 合法token
        req.user = decode;
        console.log(decode);
        next();
      }
    })
  }
}

//随机生成一个账号
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

//判断文件是否存在
const fileExist = async (filePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stat) => {
      if (!stat) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
  })
}

//格式化时间
const formatDate = () => {
  const TODY = new Date();
  const Y = TODY.getFullYear(),
    M = TODY.getMonth()+1,
    D = TODY.getDate(),
    H = TODY.getHours(),
    MIN = TODY.getMinutes(),
    Sec = TODY.getSeconds();
  return `${Y}-${M >= 10 ? M + '' : '0' + M}-${D >= 10 ? D + '' : '0' + D} ${H >= 10 ? H + '' : '0' + H}:${MIN >= 10 ? MIN + '' : '0' + MIN}:${Sec >= 10 ? Sec + '' : '0' + Sec}`;
}
//obj->array
const obj2array = function (obj) {
  let array = [];
  for (let key in obj) {
    array.push(obj[key]);
  }
  return array;
}
module.exports = {
  createUniqueUid,
  verifyToken,
  createUniqueAccount,
  cryptoPassword,
  sendEmail,
  fileExist,
  formatDate,
  obj2array
}