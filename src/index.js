/*
 * @Date: 2022-10-20 17:10:36
 * @LastEditors: xuanyi_ge xuanyige87@gmail.com
 * @LastEditTime: 2022-10-22 23:25:56
 * @FilePath: \NodeReactProject-BE\src\index.js
 */
// 引入第三方库
const express = require('express'),
  cors = require("cors"),
  path = require("path"),
  uploader = require("express-fileupload");
// 引入路由
const accountRouter = require("./routers/accountRouter.js");
const app = express();
const port = 5000;
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: false }));
app.use(uploader());
app.use("/api/account", accountRouter);
app.get('/', (_, res) => res.send("chamber:They want to play,let's play!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));