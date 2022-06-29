const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getCards, createCard, deleteCard, dislikeCard, likeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

router.get('/', auth, getCards);
router.post(
  '/',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().uri().required(),
    }),
  }),
  createCard
);
router.delete(
  '/:cardId',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex()
    }),
  }),
  deleteCard
);

router.put(
  '/:cardId/likes',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex()
    })
  }),
  likeCard
);

router.delete(
  '/:cardId/likes',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex()
    })
  }),
  dislikeCard
);

module.exports = router;
