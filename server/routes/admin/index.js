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
  app.use('/admin/api', router);
};
