const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const {
  errors, isCelebrateError, celebrate, Joi
} = require('celebrate');
const cookieParser = require('cookie-parser');
const { createUser, login } = require('./controllers/users')

const { PORT = 3000 } = process.env;
const app = express();
require('dotenv').config();
const { BadRequestError } = require('./errors/bad-request-err');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().uri({ scheme: ['http', 'https'] }), /* .pattern(new RegExp('/\[.*?\]|
      (?:https?:\/\/|ftp:\/\/|www\.)
      (?:(?![.,?!;:()]*(?:\s|$))[^\s]){2,}|(\w+)/gim')) */
      about: Joi.string().min(2).max(30),
    }).unknown(true),
  }),
  createUser
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }).unknown(true),
  }),
  login
);
/* app.use(express.static(path.join(__dirname, 'build'))) */
app.use('*', (_req, res) => {
  res.status(404).send({ message: 'Not found' });
});
app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    throw new BadRequestError('Ошибка валидации')
  }
  next(err)
});
app.use(errors());
app.use((err, req, res, next) => {
  if (!err.statusCode) {
    return res.status(500).send({ message: err.message });
  }
  res.status(err.statusCode).send({ message: err.message });

  return next(err);
});
app.listen(PORT);
