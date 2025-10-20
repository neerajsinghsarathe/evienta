const Joi = require('joi');

exports.createAuditLog = (req, res, next) => {
  const schema = Joi.object({
    admin_id: Joi.string().required(),
    action: Joi.string().required(),
    details: Joi.object().optional(),
    ip: Joi.string().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
