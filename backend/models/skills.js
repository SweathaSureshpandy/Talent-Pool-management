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
      through: models.student_skills,
      foreignKey: 'skill_id'
    });
  };

  return skills;
};