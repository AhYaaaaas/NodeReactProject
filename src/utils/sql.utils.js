/*
 * @Date: 2022-10-21 09:04:59
 * @LastEditors: AhYaaaaas xuanyige87@gmail.com
 * @LastEditTime: 2022-10-26 22:01:40
 * @FilePath: \NodeReactProject-BE\src\utils\sql.utils.js
 */
const { db: dbConfig } = require("../../project.config");
const mysql = require("mysql");
const NOT_EXIST = "Not Exist"
const connectDb = function () {
  let conn = mysql.createConnection(dbConfig);
  conn.connect((err) => {
    if (err) throw err
  })
  return conn;
}
const closeDB = function (conn) {
  conn.end((err) => {
    if (err) throw err
  })
}
const insertValue = function (conn, tableName, field, value) {
  const res = conn.query(`insert into ${tableName}${field} values${value}`);
  return res;
}
const selectValue = function (conn, clomun, table, condition = "1=1") {
  const sql = `select ${clomun} from ${table} where ${condition}`;
  console.log(sql);
  return new Promise((resolve, reject) => {
    conn.query(sql, (err, res) => {
      if (err) reject(err);
      if (res[0]) resolve(res[0]);
      else resolve(NOT_EXIST);
    });
    closeDB(conn)
  })
}
const updateValue = async function (conn, table, clomun, newValue,condition) {
  const sql = `update ${table} set ${clomun}=${newValue} where ${condition}`;
  try {
    await conn.query(sql);
    closeDB(conn);
  } catch (e) {
    console.log(e);
  }
}
module.exports = {
  NOT_EXIST,
  //连接数据库
  connectDb,
  //关闭数据库
  closeDB,
  //插入数据
  insertValue,
  //筛选数据
  selectValue,
  //修改数据
  updateValue,
}