const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true }
});

module.exports = mongoose.model('Table', tableSchema);