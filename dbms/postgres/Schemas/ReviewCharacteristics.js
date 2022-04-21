const Sequelize = require('sequelize');
const postgresDb = require('../postgresConnection');
const Characteristics = require('./Characteristics');
const Reviews = require('./Reviews');

const ReviewCharacteristics = postgresDb.define('characteristic', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
  },
  value: Sequelize.INTEGER,
});

ReviewCharacteristics.belongsTo(Reviews);
ReviewCharacteristics.belongsTo(Characteristics);

module.exports = ReviewCharacteristics;
