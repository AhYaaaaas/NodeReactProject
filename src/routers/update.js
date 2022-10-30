/*
 * @Date: 2022-10-26 21:46:31
 * @LastEditors: AhYaaaaas xuanyige87@gmail.com
 * @LastEditTime: 2022-10-30 10:35:06
 * @FilePath: \NodeReactProject-BE\src\routers\update.js
 */

const { connectDb, updateValue, selectValue, insertValue, closeDB } = require("../utils/sql.utils")
const Router = require("express").Router();
const { NOT_EXIST } = require("../utils/sql.utils");
const { formatDate, obj2array } = require("../utils/utils");
const { baseUrl } = require('../../project.config');
//更新个人信息
Router.put('/personalinfo', async (req, res) => {
  const obj = req.body;
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
  let result = await selectValue(conn, '*', 'personalinfo', `uid = "${uid}"`);
  result = result[0];
  if (result === NOT_EXIST) { res.status(404).end('error'); };
  res.status(200).send(result);
})
// 添加个人操作

Router.post('/actions', async (req, res) => {
  const { uid, description, type, bookid } = req.body,
    date = formatDate(),
    conn = connectDb();
  await insertValue(conn, `${"`" + uid + "`"}`, "(description,actionstime,type,bookid)", `("${description}","${date}","${type ?? 'update'}","${bookid ?? ''}")`);
  res.status(200).send("OK");
})
// 查询个人操作历史
Router.get('/actions', async (req, res) => {
  const { uid } = req.query;
  const conn = connectDb();
  const result = await selectValue(conn, "*", `${"`" + uid + "`"}`);
  let array = []
  if (result !== NOT_EXIST) {
    const { indexkey, ...rest } = result;
    array = obj2array(rest);
  }
  res.status(200).send(array);
})
//添加评论
Router.post('/comment', async (req, res) => {
  const { bookid, uid: userid, comment: content } = req.body;
  const conn = connectDb();
  const commenttime = formatDate();
  await insertValue(
    conn,
    "comments",
    "(bookid,userid,content,commenttime)",
    `("${bookid}","${userid}","${content}","${commenttime}")`
  );
  closeDB(conn);
  res.status(200).send("OK");
})
Router.get('/comment', async (req, res) => {
  const { bookid } = req.query;
  const conn = connectDb();
  const result = await selectValue(
    conn,
    "*",
    "comments",
    `bookid="${bookid}"`
  );
  let array = [];
  if (result !== NOT_EXIST) {
    array = obj2array(result);
    userinfoQueue = array.map((item) => {
      const conn = connectDb();
      return selectValue(conn, 'userName,uid,avatar,uAccount', 'userinfo', `uid="${item.userid}"`);
    })
    const userinfo = await Promise.all(userinfoQueue);
    array = array.map((item,index) => {
      return {
        ...item,
        userInfo: {
          ...userinfo[index][0],
          avatar:baseUrl + `/avatar/${userinfo[index][0]['uid']+userinfo[index][0]['avatar']}`
        }
      }
    })
  }
  res.status(200).send(array);
})

module.exports = Router;