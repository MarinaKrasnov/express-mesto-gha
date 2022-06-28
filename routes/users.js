const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  getUsers, getUser, updateUser, updateAvatar
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get('/:userId', auth, getUser);
router.patch(
  '/me',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24)
    })
  }, {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().uri().required(),
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
      avatar: Joi.string().uri().required(),
    }).unknown(true),
  }),
  auth,
  updateAvatar
);
router.use(errors());
module.exports = router;
