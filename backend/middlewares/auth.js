const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  console.log(req.headers);

  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(401).send({ message: 'Authorization required.' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.veryify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Authorization required.' });
  }

  req.user = payload;

  return next();
};

module.exports = auth;
