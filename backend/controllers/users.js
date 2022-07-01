const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'An error has occurred on the server' }));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(res.send(404).send({ message: 'User ID not found' }))
    .then((user) => res.status(201).send(user))
    .catch(next);
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((users) => users.find((user) => user._id === req.params.id))
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User ID not found' });
        return;
      }
      res.status(200).send(user);
    })
    .catch(() => res.status(500).send({ message: 'An error has occurred on the server' }));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(409).send({
          message: 'The user with the provided email address already exists',
        });
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((data) => res.status(201).send({ data }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid email or password' });
      } else {
        next(err);
      }
    });
};

const updateUserInfo = (req, res) => {
  const currentUser = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    currentUser,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(400).send({ message: 'User not found' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      } else if (err.name === 'CastError') {
        res.status().send({ message: 'Invalid User ID passed for update' });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const currentUser = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    currentUser,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(400).send({ message: 'User not found' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      } else if (err.name === 'CastError') {
        res.status().send({ message: 'Invalid avatar link passed for update' });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      res.send({ data: user.toJSON(), token });
    })
    .catch(() => {
      res.status(401).send({ message: 'Incorrect email or password' });
    });
};
module.exports = {
  getUsers,
  getCurrentUser,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
};
