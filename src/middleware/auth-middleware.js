const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.payload = payload;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
}

module.exports = {
  authenticateToken,
};
