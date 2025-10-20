const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, avatar_url, status, meta } = req.body;

    // Create user; store provided password as password_hash (no hashing configured in project)
    const user = await User.create({
      name,
      email,
      phone: phone || null,
      password_hash: password,
      avatar_url: avatar_url || null,
      role,
      status: status || 'active',
      meta: meta || null,
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || user.password_hash !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // No JWT/session configured; return minimal success response
    res.json({ message: 'Login successful', user });
  } catch (err) {
    next(err);
  }
};
