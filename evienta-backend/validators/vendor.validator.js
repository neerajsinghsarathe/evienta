const Joi = require('joi');

const orgSchema = Joi.object({
  business_name: Joi.string().required(),
  description: Joi.string().optional(),
  address: Joi.object().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  geo: Joi.object({ lat: Joi.number(), lng: Joi.number() }).optional(),
  categories: Joi.array().items(Joi.string()).optional(),
  phone: Joi.string().optional(),
  images: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.object())).optional(),
  pricing_packages: Joi.string().optional(),
  services: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.object()))
  ).optional()
});

exports.createVendorProfile = (req, res, next) => {
  const { error } = orgSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  req.body.user_id = req.user.id;
  req.body.services = req.body.services ? req.body.services.split(',').map(service => service.trim()) : [];
  next();
};

exports.bulkCreateVendorProfiles = (req, res, next) => {
  const schema = Joi.object({
    organizations: Joi.array().items(orgSchema)
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
