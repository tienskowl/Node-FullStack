module.exports = app => {
  const express = require('express');
  const router = express.Router();
  const assert = require('http-assert');
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body);
    res.send(model);
  });

  // 登录校验中间件
  const authMiddleware = require('../../middleware/auth');
  // 模型获取中间件
  const modelMiddleware = require('../../middleware/model');
  // 返回数据时将父级分类也返回  // 此处添加验证
  router.get('/', authMiddleware(), async (req, res) => {
    let queryOptions = {};
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent';
    }
    const items = await req.Model.find()
      .setOptions(queryOptions)
      .limit(10);
    res.send(items);
  });
  router.get('/:id', authMiddleware(), async (req, res) => {
    const model = await req.Model.findById(req.params.id);
    res.send(model);
  });
  router.put('/:id', authMiddleware(), async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });
  router.delete('/:id', authMiddleware(), async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body);
    res.send({ sucess: true });
  });

  // 生成统一接口
  // restful api
  // inflection 将复数转换为类名
  app.use('/admin/api/rest/:resource', modelMiddleware(), router);

  // 上传图片的处理
  const multer = require('multer');
  // __dirname 绝对路径
  const upload = multer({ dest: __dirname + '/../../uploads' });
  // 先把文件传进去，然后返回给前端信息
  app.post(
    '/admin/api/upload',
    authMiddleware(),
    upload.single('file'),
    async (req, res) => {
      const file = req.file;
      file.url = `http://localhost:3000/uploads/${file.filename}`;
      res.send(file);
    }
  );

  // 登录
  app.post('/admin/api/login', async (req, res) => {
    const { username, password } = req.body;
    // 根据用户名找用户
    const User = require('../../models/AdminUser');
    // 向数据库查询需要await
    const user = await User.findOne({ username: username }).select(
      '+password'
      // 标识要取出password
    );
    // if (!user) {
    //   return res.status(422).send({
    //     message: '用户不存在'
    //   });
    // }
    // 使用assert替换上述
    assert(user, 422, '用户不存在');
    // 校验密码
    const isValid = require('bcrypt').compareSync(password, user.password);
    // if (!isValid) {
    //   return res.status(422).send({
    //     message: '密码错误'
    //   });
    // }
    // 使用assert替换上述
    assert(isValid, 422, '密码错误');
    // 返回token  使用 jsonwebtoken 验证token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id }, app.get('secret'));
    res.send({ token });
  });

  // http-assert对应的错误处理中间件
  app.use((error, req, res, next) => {
    //发送使用assert语句传入的状态码和错误提示信息
    // 因为所有错误都被捕获，有的没有错误码，要有默认值
    res.status(error.statusCode || 500).send({
      message: error.message
    });
  });
};
