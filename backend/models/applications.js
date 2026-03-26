'use strict';

module.exports = (sequelize, DataTypes) => {
  const applications = sequelize.define('applications', {
    application_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    job_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('Pending', 'In Review', 'Accepted', 'Rejected'),
      defaultValue: 'Pending'
    },
    applied_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    tableName: 'applications',
    freezeTableName: true
  });

  applications.associate = (models) => {
    applications.belongsTo(models.jobs, { foreignKey: 'job_id' });
    applications.belongsTo(models.students, { foreignKey: 'student_id' });
  };

  return applications;
};
