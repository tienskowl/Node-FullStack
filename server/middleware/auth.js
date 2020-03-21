module.exports = options => {
  const jwt = require('jsonwebtoken');
  const AdminUser = require('../models/AdminUser');
  const assert = require('http-assert');
  return async (req, res, next) => {
    const token = String(req.headers.authorization || '')
      .split(' ')
      .pop();
    console.log(token);
    assert(token, 401, '请先登录');
    //在这里无法直接访问app对象，但是可以在req中访问到
    const { id } = jwt.verify(token, req.app.get('secret'));
    assert(id, 401, '请先登录');
    req.user = AdminUser.findById(id);
    assert(req.user, 401, '请先登录');

    await next();
  };
};
