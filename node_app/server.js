'use strict';
var fs = require('fs');
var config;
if (fs.existsSync('./config/config_prod.json')) {
    // Do something
    console.log('prod config picked');
    config = require('./config/config_prod');
}
else if (fs.existsSync('./config/config_stage.json')) {
    // Do something
    console.log('stage config picked');
    config = require('./config/config_stage');
}
else
{
	console.log('Dev/Local config picked');
	config = require('./config/config');
}


const db = require("./models");

const PORT = config.port;

const app = require('./app')();

//db.sequelize
//You can set `force` to `true` in development mode.
/*.sync({
 force: true
 })*/
 // .sync()
 // .then(function() {
    app.listen(PORT, function() {
      console.log('Umbrella api server listening on port: ' + PORT);
    });
 // })
 // .catch(err => {
  //  console.log('err', err.message)
  //.});
