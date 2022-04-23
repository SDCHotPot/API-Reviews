const Sequelize = require('sequelize');
const postgresDb = require('../postgresConnection');

const Products = postgresDb.define('product', {

  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  name: {
    type: Sequelize.STRING,
    required: true,
  },
  slogan: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING(500),
  },
  category: {
    type: Sequelize.STRING,
  },
  default_price: {
    type: Sequelize.INTEGER,
  },

}, { timestamps: false });

module.exports = Products;
