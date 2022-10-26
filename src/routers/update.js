/*
 * @Date: 2022-10-26 21:46:31
 * @LastEditors: AhYaaaaas xuanyige87@gmail.com
 * @LastEditTime: 2022-10-26 22:57:41
 * @FilePath: \NodeReactProject-BE\src\routers\update.js
 */

const { connectDb, updateValue, closeDB, selectValue } = require("../utils/sql.utils")
const Router = require("express").Router();
const NOT_EXIST = require("../utils/sql.utils");
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
Router.get('/personalinfo', async (req,res) => {
  const { uid } = req.query;
  const conn = connectDb();
  const result = await selectValue(conn, '*', 'personalinfo', `uid = "${uid}"`);
  if (result === NOT_EXIST) { res.status(404).end('error'); };
  res.status(200).send(result);
})


module.exports = Router;