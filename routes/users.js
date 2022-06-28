const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
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
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24)
    }).unknown(true)
  }),
  auth,
  getUserById
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().min(8),
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().uri({ scheme: ['http', 'https'] })/* .pattern(new RegExp('/^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=.]+$/gm')) */,
      about: Joi.string().min(2).max(30),
    }).unknown(true),
  }),
  auth,
  updateUser
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri().required({ scheme: ['http', 'https'] })/* .pattern(new RegExp('/^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=.]+$/gm')) */,
    }).unknown(true),
  }),
  auth,
  updateAvatar
);
router.use(errors());
module.exports = router;
