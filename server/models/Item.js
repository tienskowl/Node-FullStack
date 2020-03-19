const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String },
  // 类似于主键、外键
  icon: { type: String }
});

module.exports = mongoose.model('Item', schema);
