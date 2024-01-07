const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Download = sequelize.define('download', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  fileurl: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
});


module.exports =  Download;

