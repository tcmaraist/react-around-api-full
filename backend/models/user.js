const mongoose = require('mongoose');

const urlRegExp = /http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.(com|net|org|gov|io)(\/)?\b([-a-zA-Z0-9()@:%_+.~#?&=/]*)(#)?/i;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value) => urlRegExp.test(value),
      message: 'The "avatar" must be a valid url',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
