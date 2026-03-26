'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('skills', {
      skill_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      skill_name: {
        type: Sequelize.STRING,
        unique: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('skills');
  }
};