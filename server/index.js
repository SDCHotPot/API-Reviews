const express = require('express');
require('../dbms/mongo/mongoose');
require('../dbms/postgres/postgres');
const bodyParser = require('body-parser')

const router = require('./router');

const app = express();
app.use(bodyParser.json());
app.use(router);
const port = 3000;

app.listen(port, () => {
  // console.log(`listening on port ${port}`);
});
