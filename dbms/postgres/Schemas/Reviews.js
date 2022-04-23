const Sequelize = require('sequelize');
const postgresDb = require('../postgresConnection');
const Products = require('./Products');
// const ReviewCharacteristics = require('./ReviewCharacteristics');
// const Characteristics = require('./Characteristics');

const Reviews = postgresDb.define('review', {
  review_id: {
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
  rating: {
    type: Sequelize.SMALLINT,
    allowNull: false,
  },
  date: {
    type: Sequelize.BIGINT,
    defaultValue: Sequelize.NOW,
  },
  summary: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
  recommended: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  reported: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  reviewer_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  reviewer_email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  response: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  helpfulness: {
    type: Sequelize.SMALLINT,
  },
}, { timestamps: false, indexes: [{ fields: ['product_id'] }] });

// Reviews.belongsTo(Products, { foreignKey: 'product_id' });

module.exports = Reviews;
