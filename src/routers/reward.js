/*
 * @Date: 2022-10-30 11:43:07
 * @LastEditors: AhYaaaaas xuanyige87@gmail.com
 * @LastEditTime: 2022-10-30 19:15:54
 * @FilePath: \NodeReactProject-BE\src\routers\reward.js
 */
const { connectDb, insertValue, closeDB, updateValue } = require("../utils/sql.utils");

const Router = require("express").Router();
const { fuzzyQuery, NOT_EXIST } = require("../utils/sql.utils");
const { obj2array, createUniqueUid, formatDate } = require("../utils/utils");
//搜索悬赏
Router.get("/rwd", async (req, res) => {
  const { keyWord } = req.body;
  const conn = connectDb();
  const result = await fuzzyQuery(conn, "rewards", keyWord ?? "", "bookname");
  let array = [];
  if (result !== NOT_EXIST) {
    array = obj2array(result);
    array.map((item) => {
      const isTimeOut = (new Date(item['end']) - new Date(item['start'])) < 0
      return Object.assign(item, { isTimeOut })
    })
  }
  closeDB(conn);
  res.status(200).send(array);
})

//发布悬赏
Router.post('/rwd', async (req, res) => {
  const { uid, bookname, description, end } = req.body;
  const rewardid = createUniqueUid();
  const conn = connectDb();
  const start = formatDate();
  await insertValue(
    conn,
    'rewards',
    "(uid,bookname,description,start,end,rewardid)",
    `(
      "${uid}",
      "${bookname}",
      "${description}",
      "${start}",
      "${end}",
      "${rewardid}"
    )`
  )
  closeDB(conn);
  res.status(200).send("OK");
})
//完成悬赏
Router.put('/tag', async (req, res) => {
  const { rewardid } = req.body;
  const conn = connectDb();
  await updateValue(
    conn,
    'rewards',
    'isFinished',
    1,
    `rewardid = "${rewardid}"`
  );
  res.status(200).send("OK");
})
module.exports = Router;