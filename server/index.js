const express = require('express');
require('../dbms/mongo/mongoose');
require('../dbms/postgres/postgres');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  // console.log(`listening on port ${port}`);
});
