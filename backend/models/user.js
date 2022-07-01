const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const urlRegExp = /http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.(com|net|org|gov|io)(\/)?\b([-a-zA-Z0-9()@:%_+.~#?&=/]*)(#)?/i;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'explorer',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value) => urlRegExp.test(value),
      message: 'Please enter a valid url',
    },
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Please enter a valid email address',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Incorrect email or password'));
        }
        return user;
      });
    });
};

userSchema.methods.toJSON = function () {
  const { password, ...obj } = this.toObject();

  return obj;
};

module.exports = mongoose.model('user', userSchema);
