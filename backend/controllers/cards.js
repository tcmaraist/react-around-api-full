const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'An error occurred' }));
};

const createCard = (req, res, next) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidatorError') {
        next(new BadRequestError('Invalid name or link'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById({ _id: cardId })
    .orFail(() => new NotFoundError('Card ID not found'))
    .then((card) => {
      if (!(card.owner.toString() === req.user._id)) {
        next(new ForbiddenError('You do not have permission to delete'));
      }
      Card.findByIdAndRemove({ _id: cardId })
        .orFail(new NotFoundError('Card ID not found'))
        .then(() => res.status(201).send(card))
        .catch(next);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
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
        next(new NotFoundError('Card ID not found'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Invalid Card ID'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
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
        next(new NotFoundError('Card ID not found'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Invalid Card ID'));
      } else {
        next(err);
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
