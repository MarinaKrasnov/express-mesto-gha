const ForbidError = require('../errors/forbid-err');
const NotFoundError = require('../errors/not-found-error');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find()
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next)
    /* .catch((err) => res.status(500).send({ message: err.message })); */
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.id;
  Card.create({ owner, name, link })
    .then((card) => {
      res.send({ data: card });
    }).catch(next)
/*     .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Сервер не доступен' });
      }
    }); */
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка по указанному id не найдена'))
      } else if (req.user.id !== card.owner.toString()) {
        next(new ForbidError('У вас нет прав на удаление'))
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then((card) => res.status(200).send({ data: card })).catch(next)
      }
    }).catch(next)
};

module.exports.likeCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка по указанному id не найдена'))
      } else if (req.user.id !== card.owner.toString()) {
        next(new ForbidError('У вас нет прав на удаление'))
      } else {
        Card.findByIdAndUpdate(
          req.params.cardId,
          { $addToSet: { likes: req.user.id } },
          { new: true },
        )
          .then(() => res.send({ message: 'Like' }))
          .catch(next)
      }
    }).catch(next)
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка по указанному id не найдена'))
      } else if (req.user.id !== card.owner.toString()) {
        next(new ForbidError('У вас нет прав на удаление'))
      } else {
        Card.findByIdAndUpdate(
          req.params.cardId,
          { $pull: { likes: req.user.id } },
          { new: true },
        )
          .then(() => res.send({ message: 'Dislike' }))
          .catch(next)
      }
    }).catch(next)
};
