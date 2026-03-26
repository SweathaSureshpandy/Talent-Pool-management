'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      assessment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'assessments',
          key: 'assessment_id'
        },
        onDelete: 'CASCADE'
      },
      question_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      options: {
        type: Sequelize.JSON,
        allowNull: false
      },
      correct_answer: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('questions');
  }
};
