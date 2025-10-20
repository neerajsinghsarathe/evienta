const Joi = require('joi');

exports.createReview = (req, res, next) => {
  const schema = Joi.object({
    booking_id: Joi.string().required(),
    customer_id: Joi.string().required(),
    vendor_id: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
