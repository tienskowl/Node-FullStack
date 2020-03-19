module.exports = app => {
  const express = require('express');
  const router = express.Router();
  // 托管静态文件
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body);
    res.send(model);
  });
  // 返回数据时将父级分类也返回
  router.get('/', async (req, res) => {
    let queryOptions = {};
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent';
    }
    const items = await req.Model.find()
      .setOptions(queryOptions)
      .limit(10);
    res.send(items);
  });
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id);
    res.send(model);
  });
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });
  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body);
    res.send({ sucess: true });
  });

  // 生成统一接口
  // restful api
  // inflection 将复数转换为类名
  app.use(
    '/admin/api/rest/:resource',
    async (req, res, next) => {
      let modelName = require('inflection').classify(req.params.resource);
      req.Model = require(`../../models/${modelName}`);
      next();
    },
    router
  );

  // 上传图片的处理
  const multer = require('multer');
  // __dirname 绝对路径
  const upload = multer({ dest: __dirname + '/../../uploads' });
  // 先把文件传进去，然后返回给前端信息
  app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    file.url = `http://localhost:3000/uploads/${file.filename}`;
    res.send(file);
  });
};
