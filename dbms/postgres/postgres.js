require('dotenv/config');
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: `${process.env.PGUSER}`,
  password: `${process.env.PGPASSWORD}`,
  host: `${process.env.PGHOST}`,
  database: `${process.env.PGDATABASE}`,
  max: 1000,
  // connectionTimeoutMillis: 300,
  // idleTimeoutMillis: 100,

});

// console.log(process.env.PGUSER, '<<<<<<<<<<<<<<<<<<<< should be ubuntu????')
// console.log(process.env.PASSWORD);
// console.log(process.env.HOST)
// console.log(process.env.DATABASE)

// const client = new Client({
//   user: `${process.env.USER}`,
//   password: `${process.env.PASSWORD}`,
//   host: `${process.env.HOST}`,
//   database: `${process.env.DATABASE}`,
// });

// client.connect()
//   .then(() => {
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// pool.connect()
//   .then((result) => {
//   })
//   .catch((err) => {
//     console.log('connection not established');
//   });
pool.connect();

pool.on('connect', (() => {
}));

pool.on('remove', (() => {
}));

pool.on('acquire', (() => {
}));
module.exports = { pool };
