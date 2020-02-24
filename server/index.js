const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./router');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// route requests to router.js
app.use('/', router);


const port = 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`))