'use strict';

module.exports = (sequelize, DataTypes) => {
  const hr = sequelize.define('hr', {
    hr_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    company_name: DataTypes.STRING,
    website_url: DataTypes.STRING,
    industry_type: DataTypes.STRING,
    industry_id: DataTypes.STRING,
    incorporation_cert: DataTypes.STRING
  }, {
    timestamps: false,
    tableName: 'hr',        // ✅ ADD THIS
    freezeTableName: true   // ✅ ADD THIS
  });

  hr.associate = (models) => {
    hr.belongsTo(models.users, { foreignKey: 'user_id' });
  };

  return hr;
};