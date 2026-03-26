'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('jobs', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'Active',
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('jobs', 'status');
  }
};
