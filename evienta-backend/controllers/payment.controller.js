const paymentService = require('../services/payment.service');

exports.createPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};

exports.getPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    next(err);
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
    const [updated] = await paymentService.updatePayment(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Payment not found or not updated' });
    const payment = await paymentService.getPaymentById(req.params.id);
    res.json(payment);
  } catch (err) {
    next(err);
  }
};

exports.listPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.listPayments(req.query);
    res.json(payments);
  } catch (err) {
    next(err);
  }
};
