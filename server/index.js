const express = require('express');
require('dotenv').config();
require('dotenv/config');

require('../dbms/mongo/mongoose');
require('../dbms/postgres/postgres');
const bodyParser = require('body-parser');

const router = require('./router');

const app = express();
app.use(bodyParser.json());

app.use(router);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  // console.log(`listening on port ${port}`);
});
