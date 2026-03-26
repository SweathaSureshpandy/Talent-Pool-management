const { applications, jobs, students } = require('../models');

exports.applyForJob = async (req, res) => {
  try {
    const { job_id, student_id } = req.body;

    const existingApplication = await applications.findOne({
      where: { job_id, student_id }
    });

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    const newApplication = await applications.create({
      job_id,
      student_id,
      status: 'Pending'
    });

    res.status(201).json({ message: "Application submitted successfully", application: newApplication });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApplicationsByStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const apps = await applications.findAll({
      where: { student_id },
      include: [jobs]
    });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApplicationsByHr = async (req, res) => {
  try {
    const { hr_id } = req.params;
    const apps = await applications.findAll({
      include: [
        {
          model: jobs,
          where: { hr_id }
        },
        students
      ]
    });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
