'use strict';

module.exports = (sequelize, DataTypes) => {
  const students = sequelize.define('students', {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    university: DataTypes.STRING,
    degree: DataTypes.STRING,
    resume: DataTypes.STRING
  }, {
    timestamps: false
  });

  students.associate = (models) => {
    students.belongsTo(models.users, { foreignKey: 'user_id' });
    students.belongsToMany(models.skills, {
      through: models.student_skills,
      foreignKey: 'student_id'
    });
  };

  return students;
};