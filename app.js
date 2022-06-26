const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { errors, isCelebrateError } = require('celebrate');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const app = express();
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());
/* app.use(express.static(path.join(__dirname, 'build'))) */
app.use('*', (_req, res) => {
  res.status(404).send({ message: 'Not found' });
});
app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
/*     err.statusCode = 400; */
    throw new Error('Ошибка валидации')
  }
  res.status(err.statusCode).send({ message: err.message });
  next(err);
});
app.listen(PORT);
