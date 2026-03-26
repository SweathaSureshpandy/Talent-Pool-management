'use strict';

module.exports = (sequelize, DataTypes) => {
  const candidate_assessments = sequelize.define('candidate_assessments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    student_id: DataTypes.INTEGER,
    assessment_id: DataTypes.INTEGER,
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    completed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    tableName: 'candidate_assessments',
    freezeTableName: true
  });

  candidate_assessments.associate = (models) => {
    candidate_assessments.belongsTo(models.students, { foreignKey: 'student_id' });
    candidate_assessments.belongsTo(models.assessments, { foreignKey: 'assessment_id' });
  };

  return candidate_assessments;
};
