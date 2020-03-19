const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String },
  // 类似于主键、外键
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }
});

module.exports = mongoose.model('Category', schema);
