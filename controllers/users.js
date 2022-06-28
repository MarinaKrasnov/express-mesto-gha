const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Пользователь по указанному ID: ${userId} не найден` });
      } else {
        res.status(500).send({ message: 'Пользователь не найден' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    email, password, avatar, about, name
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(409).send({ message: 'Такой пользователь уже существует' })
      }
      return bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name,
            about,
            avatar,
            email,
            password: hash
          })
            .then(() => res.status(201).send({
              name: req.body.name,
              about: req.body.about,
              avatar: req.body.avatar,
              email: req.body.email
            }))
            .catch((err) => {
              if (err.name === 'ValidationError') {
                res.status(400).send({ message: 'Некорректные данные' });
              } else {
                res.status(500).send({ message: 'Ошибка по умолчанию' });
              }
            })
        })
    })
    /* .catch((err)=> res.status(500).send({err: err})) */
};

module.exports.updateUser = (req, res) => {
  const { id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    id,
    { $set: { name, about } },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Сервер не доступен' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { id } = req.user;
  User.findByIdAndUpdate(
    id,
    { $set: { avatar } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        res.status(400).send({ message: 'Пользователь не найден' });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Сервер не доступен' });
      }
    });
};
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).send({ message: 'Email или пароль не могут быть пустыми' });
  }
  return User.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      /*    return res.status(401).send({ message: 'Пользователь не найден' }); */
      return res.status(404).send({ message: 'Пользователь не найден' })
      /* return Promise.reject(new NotFoundError('Пользователь не найден')); */
    }
    return bcrypt.compare(password, user.password, ((error, isValid) => {
      if (isValid) {
        const token = jwt.sign({ id: user.id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        return res.cookie('jwt', token, { httpOnly: true, sameSite: true }).status(200).send({
          name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user.id
        });
      }
      return res.status(401).send({ message: 'Неправильные почта или пароль' });
      /* return Promise.reject(error('Неправильные почта или пароль')); */
    }))
  })/* .catch((err)=> res.status(500).send({err: err.message})) */
}
