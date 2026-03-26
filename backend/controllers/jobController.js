// Model imports moved to below step for completeness.

exports.createJob = async (req, res) => {
  try {
    const { 
      hr_id, title, description, job_type, 
      work_model, location, salary, required_skills 
    } = req.body;

    const newJob = await jobs.create({
      hr_id,
      title,
      description,
      job_type,
      work_model,
      location,
      salary
    });

    if (required_skills && required_skills.length > 0) {
      for (let skillName of required_skills) {
        let skill = await skills.findOne({ where: { skill_name: skillName } });
        if (!skill) {
          skill = await skills.create({ skill_name: skillName });
        }
        await job_skills.create({
          job_id: newJob.job_id,
          skill_id: skill.skill_id
        });
      }
    }

    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const { jobs, hr, skills, job_skills, applications, students, users } = require('../models');

exports.getAllJobs = async (req, res) => {
  try {
    const allJobs = await jobs.findAll({
      include: [
        { model: skills, through: { attributes: [] } },
        { model: applications, attributes: ['application_id'] } // Get application IDs to count them
      ]
    });
    res.json(allJobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecommendedJobs = async (req, res) => {
  try {
    // In a real scenario, we would match based on student skills.
    // For now, return all jobs as "recommended".
    const recommended = await jobs.findAll({
      include: [{ model: skills, through: { attributes: [] } }]
    });
    res.json(recommended);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
