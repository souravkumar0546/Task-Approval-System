const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TaskApprover = sequelize.define('TaskApprover', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = TaskApprover;