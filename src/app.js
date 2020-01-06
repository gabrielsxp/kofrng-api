const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
require('../db/mongoose');
require('./tasks/index');

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

module.exports = app;
