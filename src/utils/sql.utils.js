/*
 * @Date: 2022-10-21 09:04:59
 * @LastEditors: xuanyi_ge xuanyige87@gmail.com
 * @LastEditTime: 2022-10-21 09:07:32
 * @FilePath: \NodeReactProject-BE\src\utils\sql.utils.js
 */
const { db: dbConfig } = require("../../database.config");
const mysql = require("mysql");
module.exports = {
    //连接数据库
    connectDb:function connectDb() {
      let conn = mysql.createConnection(dbConfig);
      conn.connect((err) => {
        if (err) throw err
        console.log('数据库连接成功');
      })
      return conn;
    },
    //关闭数据库
    closeDB(conn) {
      conn.end((err) => {
        if (err) throw err
        console.log('数据库断开连接');
      })
    },
    insertValue(conn, tableName, field,value) {
      const res = conn.query(`insert into ${tableName}${field} values${value}`);
      return res;
    },
    selectValue(conn,clomun,table,condition="1=1") {
      const sql = `select ${clomun} from ${table} where ${condition}`;
      return new Promise((resolve,reject) => {
        conn.query(sql, (err,res) => {
          if (err) reject(err);
          resolve(res[0]);
        });
      })
    },
}