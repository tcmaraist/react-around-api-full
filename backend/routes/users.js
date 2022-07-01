const router = require('express').Router();

const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

const {
  validateRequestAuth,
  validateUserId,
} = require('../middlewares/validations');

router.get('/', validateRequestAuth, getUsers);
router.get('/me', validateRequestAuth, getCurrentUser);
router.get('/:Id', validateRequestAuth, validateUserId, getUserById);
router.patch('/me', validateRequestAuth, updateUserInfo);
router.patch('/me/avatar', validateRequestAuth, updateUserAvatar);

module.exports = router;
