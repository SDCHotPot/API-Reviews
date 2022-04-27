require('dotenv').config();

const { Client, Pool } = require('pg');

const pool = new Pool({
  user: `${process.env.USER}`,
  password: `${process.env.PASSWORD}`,
  host: `${process.env.HOST}`,
  database: `${process.env.DATABASE}`,
  port: `${process.env.PGPORT}`,
  max: 200,
  connectionTimeoutMillis: 300,
  idleTimeoutMillis: 1000,

});

pool.on('connect', (() => {
}));
const client = new Client({
  user: `${process.env.USER}`,
  password: `${process.env.PASSWORD}`,
  host: `${process.env.HOST}`,
  database: `${process.env.DATABASE}`,
});

client.connect()
  .then(() => {
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = { client, pool };
