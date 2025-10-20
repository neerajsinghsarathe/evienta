const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const notificationValidator = require('../validators/notification.validator');

router.post('/', notificationValidator.createNotification, notificationController.createNotification);
router.get('/', notificationController.listNotifications);
router.get('/:id', notificationController.getNotification);
router.put('/:id', notificationController.updateNotification);

module.exports = router;
