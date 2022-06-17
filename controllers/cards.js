const Card = require('../models/card');
const user = require('../models/user');

module.exports.getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      if (!cards) {
        throw new Error();
      }
      res.send({ data: cards })
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  console.log(owner, name, link);
  Card.create({ owner, name, link })
    .then((card) => {
      if (!card) {
        throw new Error()
      }
      res.send({ data: card })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: "Некорректные данные" });
      } else {
        res.status(500).send({ message: "Сервер не доступен" });
      }
  console.log(err.name);
})
};

module.exports.deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndDelete( id )
    .then((card) => res.send({ Removed: card}))
    .catch((err) => {
      if (res.status === 404) {
        res.status(404).send({ message: "Карточка по указанному _id не найдена" })
      } else {
   res.status(500).send({ message: err.message });
 }
      });
};

module.exports.likeCard = (req, res) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
  _id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
}

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
