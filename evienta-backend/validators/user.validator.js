const Joi = require('joi');

// Common pieces
const roleEnum = ['customer', 'vendor', 'admin'];
const statusEnum = ['active', 'suspended'];

const baseUserShape = {
  id: Joi.number().integer().required(),
  name: Joi.string().min(1).max(255),
  email: Joi.string().email().max(255),
  phone: Joi.string().max(50),
  password_hash: Joi.string().min(6).max(255),
  avatar_url: Joi.string().uri().allow('', null),
  role: Joi.string().valid(...roleEnum),
  address: Joi.string().min(1).max(255),
  status: Joi.string().valid(...statusEnum),
};

exports.createUser = (req, res, next) => {
  const schema = Joi.object({
    ...baseUserShape,
    name: baseUserShape.name.required(),
    email: baseUserShape.email.required(),
    password_hash: baseUserShape.password_hash.required(),
    role: baseUserShape.role.required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};


exports.getUser = (req, res, next) => {
  const schema = Joi.object({ id: Joi.number().integer().positive().required() });
  const { error } = schema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

exports.listUsers = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number().integer().positive(),
    name: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string().valid(...roleEnum),
    status: Joi.string().valid(...statusEnum),
  }).unknown(true); // allow other query params like pagination

  const { error } = schema.validate(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
