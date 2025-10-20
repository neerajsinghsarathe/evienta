const notificationService = require('../services/notification.service');

exports.createNotification = async (req, res, next) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.status(201).json(notification);
  } catch (err) {
    next(err);
  }
};

exports.getNotification = async (req, res, next) => {
  try {
    const notification = await notificationService.getNotificationById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    next(err);
  }
};

exports.updateNotification = async (req, res, next) => {
  try {
    const [updated] = await notificationService.updateNotification(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Notification not found or not updated' });
    const notification = await notificationService.getNotificationById(req.params.id);
    res.json(notification);
  } catch (err) {
    next(err);
  }
};

exports.listNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.listNotifications(req.query);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};
