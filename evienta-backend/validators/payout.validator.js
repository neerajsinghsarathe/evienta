const Joi = require('joi');

exports.createPayout = (req, res, next) => {
  const schema = Joi.object({
    vendor_id: Joi.string().required(),
    amount: Joi.number().required(),
    provider_payout_id: Joi.string().optional(),
    period_start: Joi.date().optional(),
    period_end: Joi.date().optional(),
    status: Joi.string().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
