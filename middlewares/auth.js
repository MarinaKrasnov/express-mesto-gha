const jwt = require('jsonwebtoken');
const ForbidError = require('../errors/forbid-err');
const UnauthorizedError = require('../errors/unauth');

const auth = (req, res, next) => {
  const { cookies } = req;
  if (!cookies) {
    /*  next(res.status(403).send({ message: 'Сбой в авторизации' })) */
    next(new ForbidError('Сбой в авторизации'));
  } else {
    const token = cookies.jwt;
    let payload;
    try {
      payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret');
    } catch (err) {
      next(new UnauthorizedError('jwt is not valid'));
      /*    next(res.status(401).send({ message: 'jwt is not valid' })) */
    }
    if (payload) {
      req.user = payload;
    }
  }
  next()
}
module.exports = auth;
/* module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');
}; */
