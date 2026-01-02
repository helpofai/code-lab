const { GlobalScript } = require('../models');

const getAllScripts = async (req, res, next) => {
  try {
    const scripts = await GlobalScript.findAll({
        order: [['createdAt', 'DESC']]
    });
    res.json(scripts);
  } catch (error) {
    next(error);
  }
};

const getActiveScripts = async (req, res, next) => {
    try {
      const scripts = await GlobalScript.findAll({
          where: { isActive: true },
          order: [['createdAt', 'ASC']]
      });
      res.json(scripts);
    } catch (error) {
      next(error);
    }
  };

const createScript = async (req, res, next) => {
  try {
    const { name, url, type, isActive } = req.body;
    const script = await GlobalScript.create({ name, url, type, isActive });
    res.status(201).json(script);
  } catch (error) {
    next(error);
  }
};

const updateScript = async (req, res, next) => {
  try {
    const { name, url, type, isActive } = req.body;
    const script = await GlobalScript.findByPk(req.params.id);
    if (!script) return res.status(404).json({ message: 'Script not found' });
    
    await script.update({ name, url, type, isActive });
    res.json(script);
  } catch (error) {
    next(error);
  }
};

const deleteScript = async (req, res, next) => {
  try {
    const script = await GlobalScript.findByPk(req.params.id);
    if (!script) return res.status(404).json({ message: 'Script not found' });
    await script.destroy();
    res.json({ message: 'Script deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllScripts, getActiveScripts, createScript, updateScript, deleteScript };
