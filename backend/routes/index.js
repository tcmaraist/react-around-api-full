const router = require('express').Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');

const { createUser, login } = require('../controllers/users');
const { validateLogin, validateUser } = require('../middlewares/validations');

router.post('/signin', validateLogin, login);
router.post('/signup', validateUser, createUser);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res) => {
  res.status(404).send({ message: 'No page found for the specified route' });
});

module.exports = router;
