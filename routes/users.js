const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, updateUser, updateAvatar, getUserById, getUser
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get(
  '/me',
  auth,
  getUser
);
router.get(
  '/:userId',
  auth,
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex()
    })
  }),
  getUserById
);

router.patch(
  '/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser
);
router.patch(
  '/me/avatar',
  auth,
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri().required().pattern(/^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/),
    }),
  }),
  updateAvatar
);
module.exports = router;
