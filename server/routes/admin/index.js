module.exports = app => {
  const express = require('express');
  const router = express.Router();
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
};
