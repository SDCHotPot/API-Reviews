require('dotenv').config();

const { Client } = require('pg');
// const Sequelize = require('sequelize');
// const postgresDb = require('./postgresConnection');
// const Reviews = require('./Schemas/Reviews');
// const Products = require('./Schemas/Products');
// const Photos = require('./Schemas/Photos');
// const Characteristics = require('./Schemas/Characteristics');
// const  ReviewCharacteristics  = require('./Schemas/ReviewCharacteristics');

const client = new Client({
  user: `${process.env.USER}`,
  password: `${process.env.PASSWORD}`,
  host: `${process.env.HOST}`,
  database: `${process.env.DATABASE}`,
});
client.connect()
  .then(() => {
    console.log(`im connected to ${client.database}`);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = client;
