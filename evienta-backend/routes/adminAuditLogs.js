const express = require('express');
const router = express.Router();
const adminAuditLogController = require('../controllers/adminAuditLog.controller');
const adminAuditLogValidator = require('../validators/adminAuditLog.validator');

router.post('/', adminAuditLogValidator.createAuditLog, adminAuditLogController.createAuditLog);
router.get('/', adminAuditLogController.listAuditLogs);
router.get('/:id', adminAuditLogController.getAuditLog);

module.exports = router;
