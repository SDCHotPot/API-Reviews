const Sequelize = require('sequelize');
const postgresDb = require('../postgresConnection');
const Reviews = require('./Reviews');

const Photos = postgresDb.define('photo', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
  },
  review_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Reviews,
      key: 'review_id',
    },
  },
  photo: {
    type: Sequelize.STRING,
  },
}, { timestamps: false, indexes: [{ fields: ['review_id'] }] });

// Photos.belongsTo(Reviews, { foreignKey: 'review_id' });

module.exports = Photos;
