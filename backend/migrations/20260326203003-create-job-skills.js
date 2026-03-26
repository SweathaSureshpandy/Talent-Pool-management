'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('job_skills', {
      id: {
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
      skill_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'skills',
          key: 'skill_id'
        },
        onDelete: 'CASCADE'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('job_skills');
  }
};
