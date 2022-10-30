/*
 * @Date: 2022-10-21 09:04:59
 * @LastEditors: AhYaaaaas xuanyige87@gmail.com
 * @LastEditTime: 2022-10-30 10:15:13
 * @FilePath: \NodeReactProject-BE\src\utils\sql.utils.js
 */
const { db: dbConfig } = require("../../project.config");
const mysql = require("mysql");
const NOT_EXIST = "Not Exist"
const connectDb = function () {
  let conn = mysql.createConnection(dbConfig);
  conn.connect();
  conn.on('error', err => {
    console.log('Re-connecting lost connection: ');
    conn = mysql.createConnection(dbConfig);
  })
  return conn;
}
const closeDB = function (conn) {
  conn.end((err) => {
    if (err) throw err
  })
}
const insertValue = async function (conn, tableName, field, value) {
  console.log(`insert into ${tableName}${field} values${value}`);
  const res = await conn.query(`insert into ${tableName}${field} values${value}`);
  return res;
}
const selectValue = function (conn, clomun, table, condition = "1=1") {
  const sql = `select ${clomun} from ${table} where ${condition}`;
  return new Promise((resolve, reject) => {
    conn.query(sql, (err, res) => {
      if (err) reject(err);
      if (res && res[0]) resolve(res);
      else resolve(NOT_EXIST);
    });
    closeDB(conn)
  })
}
const updateValue = async function (conn, table, clomun, newValue, condition) {
  const sql = `update ${table} set ${clomun}=${newValue} where ${condition}`;
  try {
    await conn.query(sql);
    closeDB(conn);
  } catch (e) {
    console.log(e);
  }
}
const createTable = async (conn, sql) => {
  try {
    const res = await conn.query(sql);
    return res;
  } catch (e) {
    console.log(e);
  }
}
const fuzzyQuery = async (conn, tableName, keyWord) => {
  const sql = `select * from ${tableName} where bookid like "%${keyWord}%" or bookname like "%${keyWord}%"`;
  return new Promise((resolve,reject) => {
    conn.query(sql, (err,res) => {
      if (err) reject(err);
      if (res && res[0]) resolve(res);
      else resolve(NOT_EXIST);
    })
  })
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
  //创建表
  createTable,
  //模糊查询
  fuzzyQuery
}