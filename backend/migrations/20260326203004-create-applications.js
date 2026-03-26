'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applications', {
      application_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      job_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'jobs',
          key: 'job_id'
        },
        onDelete: 'CASCADE'
      },
      student_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'students',
          key: 'student_id'
        },
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('Pending', 'In Review', 'Accepted', 'Rejected'),
        defaultValue: 'Pending'
      },
      applied_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('applications');
  }
};
