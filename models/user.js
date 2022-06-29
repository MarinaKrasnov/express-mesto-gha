const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Поле должно содержать не меньше двух символов'],
    maxlength: [30, 'Поле должно содержать не меньше 30 символов'],
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minlength: [2, 'Поле должно содержать не меньше двух символов'],
    maxlength: [30, 'Поле должно содержать не меньше 30 символов'],
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value) => validator.isURL(value, { protocols: ['http', 'https'], require_tld: true, require_protocol: true }),
      message: 'Нужно ввести ссылку'
    }
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введите адрес электронной почты'
    }
  },
  password: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    select: false
  }
});
module.exports = mongoose.model('user', userSchema);
