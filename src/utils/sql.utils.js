/*
 * @Date: 2022-10-21 09:04:59
 * @LastEditors: xuanyi_ge xuanyige87@gmail.com
 * @LastEditTime: 2022-10-21 14:06:21
 * @FilePath: \NodeReactProject-BE\src\utils\sql.utils.js
 */
const { db: dbConfig } = require("../../project.config");
const mysql = require("mysql");
const connectDb = function () {
  let conn = mysql.createConnection(dbConfig);
  conn.connect((err) => {
    if (err) throw err
    console.log('数据库连接成功');
  })
  return conn;
}
const closeDB = function (conn) {
  conn.end((err) => {
    if (err) throw err
    console.log('数据库断开连接');
  })
}
const insertValue = function (conn, tableName, field, value) {
  const res = conn.query(`insert into ${tableName}${field} values${value}`);
  return res;
}
const selectValue = function (conn, clomun, table, condition = "1=1") {
  const sql = `select ${clomun} from ${table} where ${condition}`;
  return new Promise((resolve, reject) => {
    conn.query(sql, (err, res) => {
      if (err) reject(err);
      resolve(res[0]);
    });
  })
}
module.exports = {
  //连接数据库
  connectDb,
  //关闭数据库
  closeDB,
  //插入数据
  insertValue,
  //修改数据
  selectValue,
}