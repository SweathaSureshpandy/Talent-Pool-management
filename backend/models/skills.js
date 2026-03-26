'use strict';

module.exports = (sequelize, DataTypes) => {
  const skills = sequelize.define('skills', {
    skill_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    skill_name: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    timestamps: false
  });

  skills.associate = (models) => {
    skills.belongsToMany(models.students, {
      through: 'student_skills',
      foreignKey: 'skill_id',
      otherKey: 'student_id'
    });
    skills.belongsToMany(models.jobs, {
      through: 'job_skills',
      foreignKey: 'skill_id',
      otherKey: 'job_id'
    });
  };

  return skills;
};