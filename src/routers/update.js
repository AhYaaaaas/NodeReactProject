/*
 * @Date: 2022-10-26 21:46:31
 * @LastEditors: AhYaaaaas xuanyige87@gmail.com
 * @LastEditTime: 2022-10-27 14:35:49
 * @FilePath: \NodeReactProject-BE\src\routers\update.js
 */

const { connectDb, updateValue, selectValue,insertValue,closeDB } = require("../utils/sql.utils")
const Router = require("express").Router();
const NOT_EXIST = require("../utils/sql.utils");
const { formatDate } = require("../utils/utils");
//更新个人信息
Router.put('/personalinfo', async (req, res) => {
  const obj = req.body;
  console.log(obj);
  const signs = [
    "userName",
    "year",
    "month",
    "day",
    "address",
    "company",
    "phone",
    "signature"
  ]
  for (let key of signs) {
    const conn = connectDb();
    await updateValue(conn, 'personalinfo', key, `"${obj[key]}"`, `uid = "${obj['uid']}"`);
  }
  res.status(200).send("OK");
});
// 获取个人信息
Router.get('/personalinfo', async (req, res) => {
  const { uid } = req.query;
  const conn = connectDb();
  const result = await selectValue(conn, '*', 'personalinfo', `uid = "${uid}"`);
  if (result === NOT_EXIST) { res.status(404).end('error'); };
  res.status(200).send(result);
})
// 添加个人操作
Router.post('/actions', (req, res) => {
  const { uid, description } = req.body,
    date = formatDate(),
    conn = connectDb();
  insertValue(conn, "useractions", "(uid,description,actiontime)", `("${uid}","${description}","${date}")`);
  res.status(200).send("OK");
})
// 查询个人操作历史
Router.get('/actions', async (req, res) => {
  const { uid } = req.query;
  const conn = connectDb();
  const result = await selectValue(conn, "*", "useractions", `uid = "${uid}"`);
  res.status(200).send(result);
})
module.exports = Router;