/*
 * @Date: 2022-10-20 17:10:36
 * @LastEditors: AhYaaaaas xuanyige87@gmail.com
 * @LastEditTime: 2022-10-30 19:37:21
 * @FilePath: \NodeReactProject-BE\src\index.js
 */
// 引入第三方库
const express = require('express'),
  cors = require("cors"),
  path = require("path"),
  uploader = require("express-fileupload");
// 引入路由
const accountRouter = require("./routers/accountRouter.js");
const uploadRouter = require("./routers/uploadRouter");
const updateRouter = require('./routers/update');
const downloadRouter = require('./routers/downLoadRouter');
const rewardRouter = require('./routers/reward');
const app = express();
const port = 5000;
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../public/static")));
app.use(express.urlencoded({ extended: false }));
app.use(uploader({
  createParentPath: true,
  defParamCharset: "utf-8",
}));

app.use("/api/account", accountRouter);
app.use("/api/upload", uploadRouter);
app.use('/api/update', updateRouter);
app.use('/api/download', downloadRouter);
app.use('/api/reward', rewardRouter);
app.get('/', (_, res) => res.send("chamber:They want to play,let's play!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));