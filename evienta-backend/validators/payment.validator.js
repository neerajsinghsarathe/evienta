const Joi = require('joi');

exports.createPayment = (req, res, next) => {
  const schema = Joi.object({
    booking_id: Joi.string().required(),
    amount: Joi.number().required(),
    currency: Joi.string().optional(),
    provider: Joi.string().optional(),
    provider_charge_id: Joi.string().optional(),
    status: Joi.string().optional(),
    refunded_amount: Joi.number().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
