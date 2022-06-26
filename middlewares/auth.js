const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV;
const auth = (req, res, next) => {
  const  cookies  = req.cookies;
  if (!cookies) {
    next(res.status(403).send({ error: 'Сбой в авторизации' }))
  } else {
    const token = cookies.jwt;
    let payload;
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      console.log(payload);
    } catch (err) {
      next(res.status(401).send({ error: 'jwt is not valid' }))
    }
     req.user = payload ;
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
