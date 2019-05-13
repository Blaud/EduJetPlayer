const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
    default: '',
  },
  lastDeckName: {
    type: String,
    default: 'Default',
  },
  lastModelName: {
    type: String,
    default: 'Basic',
  },
});

module.exports = mongoose.model('users', userSchema);
