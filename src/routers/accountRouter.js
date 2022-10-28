/*
 * @Date: 2022-10-20 17:55:07
 * @LastEditors: AhYaaaaas xuanyige87@gmail.com
 * @LastEditTime: 2022-10-28 19:35:27
 * @FilePath: \NodeReactProject-BE\src\routers\accountRouter.js
 */
const SECRETKEY = "gexuanyi";
const Router = require("express").Router();
const jwt = require("jsonwebtoken");
const {
  messageMap,
  statusMap
} = require("../../project.config");
const {
  createUniqueUid,
  createUniqueAccount,
  verifyToken,
  cryptoPassword,
  sendEmail,
} = require("../utils/utils");
const {
  insertValue,
  closeDB,
  connectDb,
  selectValue,
  NOT_EXIST,
  createTable
} = require('../utils/sql.utils')
Router.post("/register", async (req, res) => {
  const conn = connectDb();
  const { userName, password, uEmail } = req.body;
  const uid = createUniqueUid();
  const uAccount = createUniqueAccount();
  const r_1 = await insertValue(conn, "userInfo", "(userName,password,uid,uAccount,uEmail)", `("${userName}","${cryptoPassword(password)}","${uid}","${uAccount}","${uEmail}")`);
  const r_2 = await insertValue(conn, "personalinfo", "(uid,userName)", `("${uid}","${userName}")`);
  const r_3 = createTable(conn, `
  CREATE TABLE ${"`" + uid + "`"}(
    indexkey int AUTO_INCREMENT UNIQUE, 
    description varchar(255) NOT NULL, 
    actionstime varchar(255) NOT NULL, 
    type ENUM("upload","download","update"), 
    bookid varchar(255))
  `)
  closeDB(conn);
  res.send({
    userName,
    uAccount,
    password,
    uid,
    uEmail
  })
})
// 登陆前验证token是否有效
Router.use("/login", verifyToken);
Router.post("/login", async (req, res) => {
  let { password, uAccount } = req.body;
  const conn = connectDb();
  const { uid, uAccount: tokenAccount } = req.user || {};
  const queryResult =
    await selectValue
      (
        conn, "*",
        "userInfo",
        `(uAccount = "${uAccount || tokenAccount}" or uEmail = "${uAccount || tokenAccount}") ${req.user ? "" : `and password = "${cryptoPassword(password)}"`}`
      );
  const token = jwt.sign({ uid, uAccount }, SECRETKEY, { expiresIn: 60 * 60 * 24 })
  if (queryResult !== NOT_EXIST) {
    const { password: _, ...rest } = queryResult[0];
    res.send({
      status: statusMap["OK"],
      token,
      userInfo: rest
    })
  } else {
    res.send({
      status: statusMap["BAD_REQUEST"],
      message: messageMap["ACCOUNT_ERROR"]
    })
  }
})
const userMap = new Map();
Router.post("/code", (req, res) => {
  const { uEmail, uCode } = req.body;
  const isRight = (uCode && userMap[uEmail] === +uCode) && (delete userMap[uEmail]);
  delete userMap[uEmail];
  res.send({
    status: isRight ? statusMap["OK"] : statusMap["BAD_REQUEST"],
    message: isRight ? messageMap["IDENTIFY_OK"] : messageMap["IDENTIFY_NOT_OK"]
  })
})
Router.get("/code", async (req, res) => {
  const { uEmail } = req.query;
  //检查邮箱是否被注册
  const conn = connectDb();
  const result = await selectValue(conn, "uid", "userInfo", `uEmail = "${uEmail}"`);
  if (result !== NOT_EXIST) {
    res.send({
      status: statusMap["BAD_REQUEST"],
      message: messageMap["EMAIL_EXISTED"],
    })
  } else {
    //生成发送验证码
    const code = parseInt(Math.random() * 8999 + 1000);
    userMap[uEmail] = code;
    const error = sendEmail(uEmail, code);
    res.send({
      message: error ? messageMap["EMAIL_ERROR"] : messageMap["GENERATE_CODE_SUCCESS"],
      status: error ? statusMap["BAD_REQUEST"] : statusMap["OK"],
    })
  }
})
module.exports = Router