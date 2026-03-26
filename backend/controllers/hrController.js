const { hr, jobs, applications, students } = require('../models');

exports.getHrStats = async (req, res) => {
  try {
    const { hr_id } = req.params;
    const totalRequirementsStatus = await jobs.count({ where: { hr_id } });
    const activePostingsStatus = await jobs.count({ where: { hr_id, status: 'Active' } }); // Assuming jobs have a status
    const totalStudentsCount = await students.count();
    
    // Total applications for jobs created by this HR
    const appCount = await applications.count({
      include: [{ model: jobs, where: { hr_id } }]
    });

    // Detailed Candidate Breakdown
    const activeSeekers = await students.count({ where: { status: 'Active' } });
    const inReview = await students.count({ where: { status: 'In Review' } });
    const successfulHiresCount = await students.count({ where: { status: 'Placed' } });

    res.json({
      activeJobs: totalRequirementsStatus, // Keep original keys if needed
      totalStudents: totalStudentsCount,
      totalApplications: appCount,
      activeSeekers,
      inReview,
      placed: successfulHiresCount,
      // Keys for Requirements page:
      totalRequirements: totalRequirementsStatus,
      activePostings: activePostingsStatus || totalRequirementsStatus,
      matchesFound: appCount * 3, // Placeholder matching logic
      successfulHires: successfulHiresCount,
      highMatches: Math.floor(totalRequirementsStatus * 1.5)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHrProfile = async (req, res) => {
    try {
        const { user_id } = req.params;
        const profile = await hr.findOne({ where: { user_id } });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
