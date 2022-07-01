const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const routes = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(PORT, () => console.log('ok'));
