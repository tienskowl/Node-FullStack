module.exports = app => {
  const express = require('express');
  const router = express.Router();
  const category = require('../../models/category');
  router.post('/categories', async (req, res) => {
    const model = await category.create(req.body);
    res.send(model);
  });
  router.get('/categories', async (req, res) => {
    const items = await category.find().limit(10);
    res.send(items);
  });
  router.get('/categories/:id', async (req, res) => {
    const model = await category.findById(req.params.id);
    res.send(model);
  });
  router.put('/categories/:id', async (req, res) => {
    const model = await category.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });
  router.delete('/categories/:id', async (req, res) => {
    const model = await category.findByIdAndDelete(req.params.id, req.body);
    res.send({ sucess: true });
  });
  app.use('/admin/api', router);
};
