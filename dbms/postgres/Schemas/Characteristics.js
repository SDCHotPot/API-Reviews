const Sequelize = require('sequelize');
const postgresDb = require('../postgresConnection');
const Products = require('./Products');

const Characteristics = postgresDb.define('characteristic', {

  characteristic_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
  },
  product_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Products,
      key: 'id',
    },
  },
  name: {
    type: Sequelize.STRING(30),
  },
}, { timestamps: false, indexes: [{ fields: ['product_id'] }] });

// Characteristics.belongsTo(Products, { foreignKey: 'characteristic_id' });
module.exports = Characteristics;
