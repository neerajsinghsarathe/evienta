const Notification = require('../models/Notification');

module.exports = {
  async createNotification(data) {
    return await Notification.create(data);
  },
  async getNotificationById(id) {
    return await Notification.findByPk(id);
  },
  async updateNotification(id, data) {
    return await Notification.update(data, { where: { id } });
  },
  async listNotifications(filter = {}) {
    return await Notification.findAll({ where: filter });
  },
};
