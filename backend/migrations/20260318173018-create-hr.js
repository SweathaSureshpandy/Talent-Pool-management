'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hr', {
      hr_id: {
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
      company_name: Sequelize.STRING,
      website_url: Sequelize.STRING,
      industry_type: Sequelize.STRING,
      industry_id: Sequelize.STRING
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('hr');
  }
};