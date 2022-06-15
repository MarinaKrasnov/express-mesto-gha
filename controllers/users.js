const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new Error()
      }
      res.send({ data: user })
    })
    .catch((err) => {
      res.status(404).send({ message: `Пользователь по указанному ID: ${userId} не найден` });
      res.status(500).send({ message: 'Пользователь не найден' })
})

};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create(({ name, about, avatar }))
  .then((user) => res.send({ data: user }))
  .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findOneAndUpdate(

    { id:req.user._id}, { $set: { name, about } },
    { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.updateAvatar = (req, res) => {
  const {avatar} = req.body
  User.findOneAndUpdate( { id:req.user._id}, { $set: { avatar } },
  { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: err.message }));
};