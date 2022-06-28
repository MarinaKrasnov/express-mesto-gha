const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { cookies } = req;
  if (!cookies) {
    next(res.status(403).send({ message: 'Сбой в авторизации' }))
  } else {
    const token = cookies.jwt;
    let payload;
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
      next(res.status(401).send({ message: 'jwt is not valid' }))
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
