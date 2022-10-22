/*
 * @Date: 2022-10-20 17:40:02
 * @LastEditors: xuanyi_ge xuanyige87@gmail.com
 * @LastEditTime: 2022-10-22 23:25:47
 * @FilePath: \NodeReactProject-BE\project.config.js
 */
module.exports = {
  db: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root', //NodeReactProject
    password: 'gexuanyi0',
    database: 'NodeReactProject'
  },
  emailConfig: {
    service: 'qq',
    secure: true,
    auth: {
      user: "2780775353@qq.com",
      pass: "fsjwnhilwwwjdfha"
    }
  },
  messageMap: {
    ACCOUNT_ERROR: "账号或密码错误",
    IDENTIFY_OK: "验证通过",
    IDENTIFY_NOT_OK: "验证失败",
    EMAIL_EXISTED: "邮箱已存在",
    EMAIL_ERROR: "邮箱错误",
    GENERATE_CODE_SUCCESS: "生成验证码完成",
    TOKEN_DISAPPEAR: "没有携带token",
    INVALID_TOKEN: "无效token"
  },
  statusMap: {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
  },
  defaultUser: {
    "userName": "小兵张嘎",
    "uAccount": 42244505943,
    "password": "123456",
    "uid": "dbf7f27b1867455297555ca25fc60c31",
    "uEmail": "2780775353@qq.com"
  }
}