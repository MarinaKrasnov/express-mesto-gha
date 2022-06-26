const mongoose = require('mongoose');

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
    /*     validate: {
      validator: function(v) {
        return /-._~:/?#[]@!$&'()*+,;=/gi;
      },
      message: props => `${props.value} is not a valid phone number!`
    }, */
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле должно быть заполнено']
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Поле должно быть заполнено'],
    select: false
  }
});
module.exports = mongoose.model('user', userSchema);
