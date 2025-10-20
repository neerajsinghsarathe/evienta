const Joi = require('joi');

exports.createNotification = (req, res, next) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    type: Joi.string().required(),
    payload: Joi.object().optional(),
    read: Joi.boolean().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
