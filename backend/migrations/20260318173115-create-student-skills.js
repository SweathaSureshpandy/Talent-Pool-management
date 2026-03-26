'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_skills', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      student_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'students',
          key: 'student_id'
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
    await queryInterface.dropTable('student_skills');
  }
};