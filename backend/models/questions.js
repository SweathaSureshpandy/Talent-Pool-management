'use strict';

module.exports = (sequelize, DataTypes) => {
  const questions = sequelize.define('questions', {
    question_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    assessment_id: DataTypes.INTEGER,
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false
    },
    correct_answer: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'questions',
    freezeTableName: true
  });

  questions.associate = (models) => {
    questions.belongsTo(models.assessments, { foreignKey: 'assessment_id' });
  };

  return questions;
};
