const payoutService = require('../services/payout.service');

exports.createPayout = async (req, res, next) => {
  try {
    const payout = await payoutService.createPayout(req.body);
    res.status(201).json(payout);
  } catch (err) {
    next(err);
  }
};

exports.getPayout = async (req, res, next) => {
  try {
    const payout = await payoutService.getPayoutById(req.params.id);
    if (!payout) return res.status(404).json({ message: 'Payout not found' });
    res.json(payout);
  } catch (err) {
    next(err);
  }
};

exports.updatePayout = async (req, res, next) => {
  try {
    const [updated] = await payoutService.updatePayout(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Payout not found or not updated' });
    const payout = await payoutService.getPayoutById(req.params.id);
    res.json(payout);
  } catch (err) {
    next(err);
  }
};

exports.listPayouts = async (req, res, next) => {
  try {
    const payouts = await payoutService.listPayouts(req.query);
    res.json(payouts);
  } catch (err) {
    next(err);
  }
};
