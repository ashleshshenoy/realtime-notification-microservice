const jwt = require('jsonwebtoken');

const authorize = (socket, next) => {
  let token = socket.handshake.headers['authorization'];

  if (!token) {
    socket.emit('auth_error', { error: 'Access denied. No token provided' });
    socket.disconnect(true);
    return;
  }

   token = token.replace('Bearer ', '');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = verified;
    next();
		// eslint-disable-next-line
  } catch (error) {
    socket.emit('auth_error', { error: 'Access Denied, Invalid token provided' });
    socket.disconnect(true); 
  }
};

module.exports = authorize;


module.exports = {
    authorize
}