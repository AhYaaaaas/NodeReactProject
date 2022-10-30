/*
 * @Date: 2022-10-20 17:40:02
 * @LastEditors: AhYaaaaas xuanyige87@gmail.com
 * @LastEditTime: 2022-10-30 19:36:15
 * @FilePath: \NodeReactProject-BE\project.config.js
 */
module.exports = {
  db: {
    host: '127.0.0.1',
    port: 3306,
    user: 'NodeReactProject', //root
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
  baseUrl: "http://43.143.194.105:5000",
}