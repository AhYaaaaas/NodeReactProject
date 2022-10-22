/*
 * @Date: 2022-10-20 17:40:02
 * @LastEditors: xuanyi_ge xuanyige87@gmail.com
 * @LastEditTime: 2022-10-21 13:21:40
 * @FilePath: \NodeReactProject-BE\project.config.js
 */
module.exports = {
  db: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'gexuanyi0',
    database: 'NodeReactProject'
  },
  emailConfig: {
    service: 'gmail',
    secure: true,
    auth: {
      user: "xuanyige87@gmail.com",
      pass: "ymklyzwhluzwbnfo"
    }
  }
}