const { assessments, questions, candidate_assessments } = require('../models');

exports.getAssessments = async (req, res) => {
  try {
    const list = await assessments.findAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await assessments.findByPk(id, {
      include: [questions]
    });
    if (!assessment) return res.status(404).json({ message: "Assessment not found" });
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitAssessment = async (req, res) => {
  try {
    const { student_id, assessment_id, score } = req.body;
    const result = await candidate_assessments.create({
      student_id,
      assessment_id,
      score,
      completed_at: new Date()
    });
    res.status(201).json({ message: "Assessment submitted", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getResultsByStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const results = await candidate_assessments.findAll({
      where: { student_id },
      include: [assessments]
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
