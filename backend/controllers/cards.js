const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'An error occurred' }));
};

const createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidatorError') {
        res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByID(cardId)
    .orFail(() => {
      const error = new Error('No card found for the specified id');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => Card.deleteOne(card).then(() => res.send({ data: card })))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid cardId' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const likeCard = (req, res) => {
  const currentUser = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: currentUser } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: ' Card not found' });
      } else if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Invalid Card ID passed for liking a card',
        });
      } else {
        res.status(500).send({
          message: ' An error has occurred on the server',
        });
      }
    });
};

const dislikeCard = (req, res) => {
  const currentUser = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: currentUser } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Card not found' });
      } else if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Invalid Card ID passed for disliking a card',
        });
      } else {
        res.status(500).send({
          message: 'An error has occurred on the server',
        });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
