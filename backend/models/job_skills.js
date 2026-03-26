'use strict';

module.exports = (sequelize, DataTypes) => {
  const job_skills = sequelize.define('job_skills', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    job_id: DataTypes.INTEGER,
    skill_id: DataTypes.INTEGER
  }, {
    timestamps: false,
    tableName: 'job_skills',
    freezeTableName: true
  });

  return job_skills;
};
