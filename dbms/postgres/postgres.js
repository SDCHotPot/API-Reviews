require('dotenv/config');
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: `${process.env.PGUSER}`,
  password: `${process.env.PGPASSWORD}`,
  host: `${process.env.PGHOST}`,
  database: `${process.env.PGDATABASE}`,
  max: `${process.env.PGMAX}`,
});

pool.connect();

pool.on('connect', (() => {
}));

pool.on('remove', (() => {
}));

pool.on('acquire', (() => {
}));

setInterval(() => {
  console.log(`${pool.totalCount} total users connected`);
}, 10000);

module.exports = { pool };
