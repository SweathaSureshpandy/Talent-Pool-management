'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add column if not exists
    const tableInfo = await queryInterface.describeTable('students');
    if (!tableInfo.status) {
      await queryInterface.addColumn('students', 'status', {
        type: Sequelize.STRING,
        defaultValue: 'Active'
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('students', 'status');
  }
};
