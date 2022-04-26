require('dotenv').config();

const { Client, Pool } = require('pg');

const pool = new Pool({
  user: `${process.env.USER}`,
  password: `${process.env.PASSWORD}`,
  host: `${process.env.HOST}`,
  database: `${process.env.DATABASE}`,
  max: 100,
  connectionTimeoutMillis: 300,
  idleTimeoutMillis: 1000,

});

pool.on('connect', (() => {
  console.log(`${pool.totalCount} users active`);
}));
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

module.exports = { client, pool };
