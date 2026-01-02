const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Pen = sequelize.define('Pen', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: 'Untitled',
  },
  html: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  css: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  js: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

module.exports = Pen;
