const Joi = require('joi');

exports.createBooking = (req, res, next) => {
  const schema = Joi.object({
    customer_id: Joi.string().required(),
    vendor_id: Joi.string().required(),
    service_id: Joi.string().required(),
    start_datetime: Joi.date().required(),
    end_datetime: Joi.date().required(),
    hours: Joi.number().required(),
    hourly_rate: Joi.number().required(),
    total_amount: Joi.number().required(),
    notes: Joi.string().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
