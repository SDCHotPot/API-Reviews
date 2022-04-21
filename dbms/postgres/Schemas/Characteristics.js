const Sequelize = require('sequelize');
const postgresDb = require('../postgresConnection');
const Products = require('./Products');

const Characteristics = postgresDb.define('characteristic', {

  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: Sequelize.STRING,
  },
});

Characteristics.belongsTo(Products);
module.exports = Characteristics;
