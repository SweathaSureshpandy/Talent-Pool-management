'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
      job_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      hr_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'hr',
          key: 'hr_id'
        },
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      job_type: {
        type: Sequelize.ENUM('Full-time', 'Contract'),
        allowNull: false
      },
      work_model: {
        type: Sequelize.ENUM('Remote', 'Hybrid', 'On-site'),
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      salary: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('jobs');
  }
};
