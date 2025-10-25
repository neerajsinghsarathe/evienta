// Simple authentication middleware placeholder
// Usage: app.use(authMiddleware) or on specific routes
// This is a minimal example; replace with real token/session verification.
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

module.exports = function authMiddleware(req, res, next) {
  // Example: check for an Authorization header (Bearer token pattern)
  const authHeader = req.headers && req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Example parse (no real verification here)
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(400).json({ message: 'Invalid authorization header' });
  }

  // Place to verify token (JWT, session lookup, etc.)
  const verifiedPayload = jwt.verify(token, secret);
  console.log(verifiedPayload);
  if (!verifiedPayload) {
      return res.status(401).json({ message: 'Unauthorized' });
  }
  req.user = { id: verifiedPayload.id, email: verifiedPayload.email ,role: verifiedPayload.role};
  return next();
};
