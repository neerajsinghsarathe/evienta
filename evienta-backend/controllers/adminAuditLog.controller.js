const adminAuditLogService = require('../services/adminAuditLog.service');

exports.createAuditLog = async (req, res, next) => {
  try {
    const log = await adminAuditLogService.createAuditLog(req.body);
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

exports.getAuditLog = async (req, res, next) => {
  try {
    const log = await adminAuditLogService.getAuditLogById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Audit log not found' });
    res.json(log);
  } catch (err) {
    next(err);
  }
};

exports.listAuditLogs = async (req, res, next) => {
  try {
    const logs = await adminAuditLogService.listAuditLogs(req.query);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};
