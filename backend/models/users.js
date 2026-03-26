'use strict';

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    hashed_password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'student', 'hr'),
      allowNull: false
    }
  }, {
    timestamps: false
  });

  users.associate = (models) => {
    users.hasOne(models.students, { foreignKey: 'user_id' });
    users.hasOne(models.hr, { foreignKey: 'user_id' });
  };

  return users;
};