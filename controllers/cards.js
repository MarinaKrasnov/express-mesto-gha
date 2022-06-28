const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user.id;
  Card.create({ owner, name, link })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Сервер не доступен' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
      }
      if (req.user.id !== card.owner) {
        return res.status(403).send({ message: 'У вас нет прав на удаление' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
      } else {
        res.send({ message: 'Like' });
      }
    })
    .catch((err) => {
      /*      if (err.name === 'Error') {
        res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
      } */
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка по указанному _id не найдена' });
      } else {
        res.send({ message: 'Dislike' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};
