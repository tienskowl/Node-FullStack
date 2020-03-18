// 服务端入口文件
const express = require('express');

const app = express();
app.use(express.json());
app.use(require('cors')());
require('./plugins/db')(app); //连接数据库
require('./routes/admin/index')(app); //监听api

app.listen(3000, () => {
  console.log('正在监听 3000 端口');
});
