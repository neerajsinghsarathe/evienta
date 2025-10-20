const serviceService = require('../services/service.service');

exports.createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.body);
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
};

exports.getService = async (req, res, next) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    next(err);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const [updated] = await serviceService.updateService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Service not found or not updated' });
    const service = await serviceService.getServiceById(req.params.id);
    res.json(service);
  } catch (err) {
    next(err);
  }
};

exports.listServices = async (req, res, next) => {
  try {
    const services = await serviceService.listServices(req.query);
    res.json(services);
  } catch (err) {
    next(err);
  }
};
