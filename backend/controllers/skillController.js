const { skills } = require('../models');

exports.getAllSkills = async (req, res) => {
  try {
    const list = await skills.findAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
