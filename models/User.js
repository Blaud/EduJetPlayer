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
  lastlang: {
    type: String,
    default: 'ru',
  },
  lastfromlang: {
    type: String,
    default: 'en',
  },
  lastDeckName: {
    type: String,
    default: 'Default',
  },
  lastModelName: {
    type: String,
    default: 'Basic',
  },
  lastVideos: [
    {
      fulltitle: {
        type: String,
      },
      webpage_url: {
        type: String,
      },
      thumbnail: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model('users', userSchema);
