// 服务端入口文件
const express = require('express');

const app = express();
app.use(express.json());
app.use(require('cors')());
// 托管静态文件 可以通过‘/uploads’访问服务端绝对路径下
app.use('/uploads', express.static(__dirname + '/uploads'));
// 为jwt验证配置secretkey
app.set('secret', 'isadf2134fldsaf');
require('./plugins/db')(app); //连接数据库
require('./routes/admin/index')(app); //监听api

app.listen(3000, () => {
  console.log('正在监听 3000 端口');
});
