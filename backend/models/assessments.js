'use strict';

module.exports = (sequelize, DataTypes) => {
  const assessments = sequelize.define('assessments', {
    assessment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    time_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 20
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    tableName: 'assessments',
    freezeTableName: true
  });

  assessments.associate = (models) => {
    assessments.hasMany(models.questions, { foreignKey: 'assessment_id' });
    assessments.hasMany(models.candidate_assessments, { foreignKey: 'assessment_id' });
  };

  return assessments;
};
