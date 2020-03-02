const dotenv = require('dotenv').config({path: __dirname + '/.env'});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');

// test to see if process.env is  reading .env file correctly
if (dotenv.error) {throw dotenv.error};

// provide data for requests and responses
app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// route requests to router.js
app.use('/', router);


const port = 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`))