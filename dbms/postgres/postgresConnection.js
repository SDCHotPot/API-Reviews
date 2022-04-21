require('dotenv').config();
const Sequelize = require('sequelize');

const postgresDb = new Sequelize(`${process.env.DATABASE}`, `${process.env.USER}`, `${process.env.PASSWORD}`, {
  host: `${process.env.HOST}`,
  dialect: 'postgres',
});

module.exports = postgresDb;
