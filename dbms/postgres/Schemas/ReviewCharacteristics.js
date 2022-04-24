const Sequelize = require('sequelize');
const postgresDb = require('../postgresConnection');
// const Reviews = require('./Reviews');
// const Products = require('./Products');

const Characteristics = require('./Characteristics');
const Reviews = require('./Reviews');

const ReviewCharacteristics = postgresDb.define('review_characteristics', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
  },
  characteristic_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Characteristics,
      key: 'characteristic_id',
    },
  },
  review_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Reviews,
      key: 'review_id',
    },
  },
  value: Sequelize.INTEGER,
}, { timestamps: false });

// ReviewCharacteristics.belongsToMany(Reviews, { through: { Characteristics } });
// ReviewCharacteristics.belongsTo(Characteristics);

module.exports = { ReviewCharacteristics, Characteristics, Reviews };
