'use strict';

module.exports = (sequelize, DataTypes) => {
  const jobs = sequelize.define('jobs', {
    job_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hr_id: DataTypes.INTEGER,
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    job_type: DataTypes.ENUM('Full-time', 'Contract'),
    work_model: DataTypes.ENUM('Remote', 'Hybrid', 'On-site'),
    location: DataTypes.STRING,
    salary: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    tableName: 'jobs',
    freezeTableName: true
  });

  jobs.associate = (models) => {
    jobs.belongsTo(models.hr, { foreignKey: 'hr_id' });
    jobs.belongsToMany(models.skills, { through: 'job_skills', foreignKey: 'job_id', otherKey: 'skill_id' });
    jobs.hasMany(models.applications, { foreignKey: 'job_id' });
  };

  return jobs;
};
