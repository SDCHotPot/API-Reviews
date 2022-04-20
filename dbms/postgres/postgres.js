require('dotenv').config();

const { Client } = require('pg');
const Sequelize = require('sequelize');

const client = new Client({
  user: `${process.env.USER}`,
  password: `${process.env.PASSWORD}`,
  host: `${process.env.HOST}`,
  database: 'postgres',
});

client.connect()
  .then(() => {
    console.log('im connected');
  })
  .catch((err) => {
    console.log(err);
  });
client.query('SELECT FROM pg_database WHERE datname = $1', ['reviewssdc'])
  .then((result) => {
    if (result.rowCount === 0) {
      client.query('CREATE DATABASE reviewssdc')
        .then((result) => {
          console.log('new database created');
        })
        .catch(() => {
          console.log('something went wrong with creating table');
        });
    } else {
      if (result.rowCount === 1) {
        console.log('this table exists already')
      }
    }
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    const sequelize = new Sequelize('reviewssdc', `${process.env.USER}`, `${process.env.PASSWORD}`, {
      host: `${process.env.HOST}`,
      dialect: 'postgres',
    }, () => {
      console.log(process.env.PASSWORD);
    });
    sequelize.authenticate()
      .then(() => {
        console.log('connected to postgres');
      })
      .catch((err) => {
        console.log(err);
      });
    const Reviews = sequelize.define('review', {
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
    const Photos = sequelize.define('photo', {
      id: {
        type: Sequelize.NUMBER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      review_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Reviews',
          key: 'review_id',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
    });
    module.exports = { Photos, Reviews };
  });
