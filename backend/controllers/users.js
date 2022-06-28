const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'An error has occurred on the server' }));
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

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      } else {
        res.status(500).send({ message: 'An error has occured on the server' });
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
