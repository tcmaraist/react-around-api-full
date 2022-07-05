const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  console.log(req.headers);

  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new UnauthorizedError('Authorization Required'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.veryify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Authorization Required'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
