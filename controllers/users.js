const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauth');
const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => res.status(200).send({ data: users }))
    .catch(next)
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'))
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch(next)
};
module.exports.getUser = (req, res, next) => {
  const userId = req.user.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'))
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch(next)
};
module.exports.createUser = (req, res, next) => {
  const {
    email, password, avatar, about, name
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Такой пользователь уже существует');
      } else {
        return bcrypt.hash(password, 10)
      }
    })
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
            next(new BadRequestError('Некорректные данные'))
            /*    res.status(400).send({ message: 'Некорректные данные' }); */
          } else {
            next(err)
          }
        })
    }).catch(next)
};

module.exports.updateUser = (req, res, next) => {
  const { id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    id,
    { $set: { name, about } },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'))
      } else {
        res.send({ data: user });
      }
    })
    .catch(next)
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { id } = req.user;
  User.findByIdAndUpdate(
    id,
    { $set: { avatar } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'))
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch(next)
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      return next(new UnauthorizedError('Пользователь не найден'))
    }
    return bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError('Неправильные почта или пароль'))
        }
        const token = jwt.sign({ id: user.id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        return res.cookie('jwt', token, { httpOnly: true, sameSite: true }).status(200).send({
          name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user.id
        });
      })
      .catch(next)
  })
}
