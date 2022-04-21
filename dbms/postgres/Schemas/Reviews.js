const Sequelize = require('sequelize');
const postgresDb = require('../postgresConnection');
const Products = require('./Products');

const Reviews = postgresDb.define('review', {
  review_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  summary: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  recommended: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  body: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  response: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  reviewer_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  helpfulness: {
    type: Sequelize.INTEGER,
  },
});

Reviews.belongsTo(Products);

module.exports = Reviews;
