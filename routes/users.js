const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, createUser, updateUser, updateAvatar, login
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/me',
celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), login);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().uri().required(),
      about: Joi.string().min(2).max(30),
    }).unknown(true),
  }),
  createUser
);

router.get('/', auth, getUsers);
router.get('/:userId', auth, getUser);
router.patch('/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().uri().required(),
      about: Joi.string().min(2).max(30),
    }).unknown(true),
  }),
  auth, updateUser);
router.patch('/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri().required(),
    }).unknown(true),
  }),  auth, updateAvatar);

module.exports = router;
