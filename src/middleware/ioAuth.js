const jwt = require('jsonwebtoken');

const verifyToken = (socket, next) => {
  const token = socket.handshake.auth.token.split(' ')[1];

  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.decoded = decoded;
    next();
  } catch (error) {
    return next(new Error('Authentication error: Invalid token'));
  }
};

module.exports = {
  verifyToken,
};
