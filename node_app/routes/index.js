'use strict';
var fs = require('fs');

var config;
if (fs.existsSync('./config/config_prod.json')) {
    // Do something
    console.log('prod config picked3');
    config = require('../config/config_prod');
}
else if (fs.existsSync('./config/config_stage.json')) {
    // Do something
    console.log('stage config picked3');
    config = require('../config/config_stage');
}
else
{
  console.log('Dev/Local config picked3');
  config = require('../config/config');
}


const router = require('express').Router();

router.use('/country', require('./country'));
router.use('/user', require('./user'));
router.use('/credit', require('./credit'));
router.use('/bank', require('./bank'));
router.use('/content', require('./content'));
router.use('/android_version', require('./android_version'));
if(config.envoirnment=="dev" || config.envoirnment =="stage")
{
router.use('/secret', require('./secret'));
}
module.exports = router;
