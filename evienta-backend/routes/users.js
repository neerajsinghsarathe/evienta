const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const userValidator = require('../validators/user.validator');
const auth = require('../middleware/auth');

router.post('/', userValidator.createUser, userController.createUser);
router.get('/', userController.listUsers);
router.get('/profile', auth, userController.getUserProfile);
router.get('/:id', userController.getUser);
router.put('/:id', userValidator.updateUser,userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;