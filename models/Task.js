const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM('Awaiting Approval', 'Approved'),
    defaultValue: 'Awaiting Approval',
  },
});

module.exports = Task;