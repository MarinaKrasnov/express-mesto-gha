const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getCards, createCard, deleteCard, dislikeCard, likeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

router.get('/', auth, getCards);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().uri({ scheme: ['http', 'https'] }).required()/* .pattern(new RegExp('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=.]+$')) */,
    }).unknown(true),
  }),
  auth,
  createCard
);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24)
    }),
  }),
  auth,
  deleteCard
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24)
    })
  }),
  auth,
  likeCard
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24)
    })
  }),
  auth,
  dislikeCard
);

module.exports = router;
