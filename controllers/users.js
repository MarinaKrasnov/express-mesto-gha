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
      if (err.name==='CastError') {
        res.send({ message: `Пользователь по указанному ID: ${userId} не найден` });
      } else {
        res.status(500).send({ message: 'Пользователь не найден' })
      };
      console.log(err.name);
})
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create(({ name, about, avatar }))
  .then((user) => res.send({ data: user }))
  .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;
       User.findByIdAndUpdate(
      id, { $set: { name, about } },
      { new: true,runValidators:true })
      .then((user) => {
        if (!user) {
          console.log(err.name);
          res.status(404).send({ message: "Пользователь не найден" })
        }
        res.send({ data: user })
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: "Некорректные данные" })
        }
        else {
          res.status(500).send({message: 'Сервер не доступен'})
        }
      });
    };

    module.exports.updateAvatar = (req, res) => {
      const { avatar } = req.body
      const id = req.user._id;
      User.findByIdAndUpdate( id , { $set: { avatar } },
        { new: true })
        .then((user) => {
          if (!user) {
        res.status(400).send({ message: "Пользователь не найден" })
      }
      res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: "Некорректные данные" })
      }
      else {
        res.status(500).send({ message: 'Сервер не доступен' })
      };
      console.log(err.name)
    })
}