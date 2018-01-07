'use strict';

const Promise = require('bluebird');
const CronJob = require('cron').CronJob;
var fs = require('fs');
var config;
if (fs.existsSync('./../config/config_prod.json')) {
    // Do something
    console.log('prod config picked');
    config = require('./../config/config_prod');
}
else if (fs.existsSync('./../config/config_stage.json')) {
    // Do something
    console.log('stage config picked');
    config = require('./../config/config_stage');
}
else
{
	console.log('Dev/Local config picked');
	config = require('./../config/config');
}
const db = require("../models");
const collectionCron = require('./collectionCrone');

new CronJob('25 * * * *', function() {
  //collectionCron();
}, null, true);
