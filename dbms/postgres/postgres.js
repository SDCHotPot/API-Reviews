require('dotenv').config();

const { Client } = require('pg');
// const Sequelize = require('sequelize');
const postgresDb = require('./postgresConnection');
const Reviews = require('./Schemas/Reviews');
const Products = require('./Schemas/Products');
const Photos = require('./Schemas/Photos');
const Characteristics = require('./Schemas/Characteristics');
const ReviewCharacteristics = require('./Schemas/ReviewCharacteristics');

const client = new Client({
  user: `${process.env.USER}`,
  password: `${process.env.PASSWORD}`,
  host: `${process.env.HOST}`,
  // database: 'reviewssdc',
});
client.connect()
  .then(() => {
    // console.log('im connected');
  })
  .catch(() => {
    // console.log(err);
  });
client.query('SELECT FROM pg_database WHERE datname = $1', [`${process.env.PASSWORD}`])
  .then((result) => {
    if (result.rowCount === 0) {
      client.query(`CREATE DATABASE ${process.env.PASSWORD}`)
        .then(() => {
          // console.log('new database created');
        })
        .catch(() => {
          // console.log('something went wrong with creating table');
        });
    }
    if (result.rowCount === 1) {
      // console.log('reviewssdc database exists already');
    }
  })
  .catch(() => {
    // console.log(err);
  })
  .then(() => {
    client.end()
      .then(() => {
        // console.log('disconnected from postgres');
      });
  })
  .finally(() => {
    postgresDb.authenticate()
      .then(() => {
        // console.log('connected to postgres 2nd time');
      })
      .catch(() => {
        // console.log(err);
      })
      .then(() => {
        Products.sync({}).then(() => {
          // console.log('products synced');
          Reviews.sync({}).then(() => {
            // console.log('reviews synced');
            Photos.sync({}).then(() => {
              // console.log('photos synced');
            });
          });
          Characteristics.sync({}).then(() => {
            // console.log('characteristics synced');
            ReviewCharacteristics.sync({}).then(() => {
              // console.log('reviewcharacterisitcs synced');
            });
          });
        });
      });
  });
