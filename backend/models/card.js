const mongoose = require('mongoose');

const urlRegExp = /http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.(com|net|org|gov|io)(\/)?\b([-a-zA-Z0-9()@:%_+.~#?&=/]*)(#)?/i;

const cardsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => urlRegExp.text(value),
      message: 'The link must be a valid url',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardsSchema);
