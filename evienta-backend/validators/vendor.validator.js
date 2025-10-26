const Joi = require('joi');

exports.createVendorProfile = (req, res, next) => {
  const orgSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    business_name: Joi.string().required(),
    description: Joi.string().optional(),
    address: Joi.object().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    geo: Joi.object({ lat: Joi.number(), lng: Joi.number() }).optional(),
    categories: Joi.array().items(Joi.string()).optional(),
    services: Joi.array().items(Joi.object()).optional(),
  });
  const schema = Joi.object({
  organizations: Joi.array().items(orgSchema)
});
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
