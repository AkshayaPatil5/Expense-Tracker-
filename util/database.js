const Sequelize=require('sequelize');
const sequelize= new Sequelize(process.env.DB_NAME, process.env.USER, process.env.DB_PASS, {
    dialect:'mysql',
    host: process.env.Host
})
module.exports = sequelize;