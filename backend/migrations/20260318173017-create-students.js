'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('students', {
      student_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      university: Sequelize.STRING,
      degree: Sequelize.STRING,
      resume: Sequelize.STRING
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('students');
  }
};