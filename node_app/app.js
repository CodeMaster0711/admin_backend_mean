'use strict'
var fs = require('fs');
var config;
if (fs.existsSync('./config/config_prod.json')) {
    // Do something
    console.log('prod config picked');
    config = require('./config/config_prod');
}
else if (fs.existsSync('./config/config_stage.json')) {
    // Do something
    console.log('stage config picked____');
    config = require('./config/config_stage');
}
else
{
  console.log('Dev/Local config picked____');
  config = require('./config/config');
}


const db = require("./models");

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const randomstring = require('randomstring');
const session = require('express-session');
var FileStore = require('session-file-store')(session);
const helmet = require('helmet');

const Errors = require('./errors');
const middlewares = require('./middlewares');
const expiryDate = new Date( Date.now() + 24 * 60 * 60 * 1000 ); // 24 hour

const app = express();

function init_umbrella_api(){

 /* app.use(function (req, res, next) {
  console.log(' Triggered nowTime:', Date.now());
  console.log(req);
  console.log("fin req");
  next()
})*/
  console.log("entered");

 // if (env === 'development) {
    app.use(logger('dev'));
 // }

  app.set('errors', Errors);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cors());
  app.use(helmet());

  app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Credentials", 'true');
    next();
  });

  app.use(session({
    secret: randomstring.generate(12),
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
    cookie: { secure: false,
      httpOnly: false,
      expires: expiryDate }
  }))

  app.set('etag', false);
app.get('/apple', function (req, res) {
  res.send('Hello World!')
});
  app.use('/api', require('./routes'));
    app.use('/api/admin/', require('./admin_routes'));
    console.log("routes loaded");
  app.use(middlewares.errorHandler);
  if(config.envoirnment=="dev")
{
db.sequelize
//You can set `force` to `true` in development mode.
.sync({
 //force: true
 })
 // .sync()
  .then(function() {
    console.log("db synced");
      console.log("entered");

  })
  .catch(err => {
    console.log('err', err.message)
    return false;
  });
 //return app;
}
}


if(config.envoirnment=="dev")
{
  module.exports = function(config) {
init_umbrella_api();
return app;
  }
}
else
{
init_umbrella_api();
module.exports = app
}





