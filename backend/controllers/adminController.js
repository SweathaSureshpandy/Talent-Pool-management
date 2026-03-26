const { users, students, hr, jobs, applications, skills } = require('../models');

exports.getStats = async (req, res) => {
  try {
    const totalStudents = await students.count();
    const totalHr = await hr.count();
    const activeJobs = await jobs.count();
    const totalApplications = await applications.count();

    res.json({
      totalStudents,
      totalHr,
      activeJobs,
      totalApplications
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await students.findAll({
      include: [
        { model: users, attributes: ['user_name', 'email'] },
        { model: skills, through: { attributes: [] } }
      ]
    });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
