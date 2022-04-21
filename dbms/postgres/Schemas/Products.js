const Sequelize = require('sequelize');
const postgresDb = require('../postgresConnection');

const Products = postgresDb.define('product', {

  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
  },
  product_id: {
    type: Sequelize.INTEGER,
    unique: true,
  },
  slogan: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  category: {
    type: Sequelize.STRING,
  },
  default_price: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Products;
