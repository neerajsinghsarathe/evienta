const userService = require('../services/user.service');

module.exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const [updated] = await userService.updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'User not found or not updated' });
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found or not deleted' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports.listUsers = async (req, res, next) => {
  try {
    const users = await userService.listUsers(req.query);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports.getUserProfile = async (req, res, next) => {
    try {
        const { id } = req.user;
        const users = await userService.getUserById(id);
        res.json(users);
    } catch (e) {
        next(e);
    }
}
