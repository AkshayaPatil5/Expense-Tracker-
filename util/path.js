const path = require('path');

module.exports = path.dirname(process.mainModule.filename);
const Sequelize=require('sequelize');
const sequelize= new Sequelize('expense_schema','root','Ak7558534825@', {
    dialect:'mysql',
    host:'localhost'
})
module.exports = sequelize;
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User= sequelize.define(
  'users',
  {
    id: {
      type: Sequelize.INTEGER, 
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  }
);