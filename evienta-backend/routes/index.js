const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const authRouter = require('./auth');
const vendorsRouter = require('./vendors');
const notificationsRouter = require('./notifications');
const servicesRouter = require('./services');
const bookingsRouter = require('./bookings');
const paymentsRouter = require('./payments');
const payoutsRouter = require('./payouts');
const reviewsRouter = require('./reviews');
const adminAuditLogsRouter = require('./adminAuditLogs');

router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/vendors', vendorsRouter);
router.use('/notifications', notificationsRouter);
router.use('/services', servicesRouter);
router.use('/bookings', bookingsRouter);
router.use('/payments', paymentsRouter);
router.use('/payouts', payoutsRouter);
router.use('/reviews', reviewsRouter);
router.use('/adminAuditLogs', adminAuditLogsRouter);

module.exports = router;
