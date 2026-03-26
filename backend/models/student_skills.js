'use strict';

module.exports = (sequelize, DataTypes) => {
  const student_skills = sequelize.define('student_skills', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    student_id: DataTypes.INTEGER,
    skill_id: DataTypes.INTEGER
  }, {
    timestamps: false
  });

  return student_skills;
};