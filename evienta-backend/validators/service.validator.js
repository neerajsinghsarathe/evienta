const Joi = require('joi');

exports.createService = (req, res, next) => {
  const schema = Joi.object({
    vendor_id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
    hourly_rate: Joi.number().required(),
    min_hours: Joi.number().min(1).optional(),
    images: Joi.array().items(Joi.string()).optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
