'use strict';

const router = require('express').Router();
const geoip = require('geoip-lite');
const _ = require('underscore');
const NodeGeocoder = require('node-geocoder');
const publicIp = require('public-ip');
const Promise = require('bluebird');

const db = require('../models');
const middlewares = require('../middlewares');
const Errors = require('../errors');
const helper = require('../helper');
const config = require('../config/config');

router.get('/', (req, res, next) => {
  console.log('Entered cpuntru',req);
    helper.getCountry(req)
    .then(data=>{
    
      if(data.err) return next(data.err)
      res.send(data.country);
    })
    .catch(err=>next(err));
});

router.post('/', (req, res, next) => {
   //lon=103.8&lat=1.3667
    helper.getCountry(req, req.body)
    .then(data=>{
      if(data.err) return next(data.err);
      res.send(data.country);
    })
    .catch(err=>next(err));
});

router.get('/settings', (req, res, next) => {
  let location;
  console.log('req.query',req.query)
  if(!_.isEmpty(req.query)){
    location = {};
    location.lon = req.query.lon;
    location.lat = req.query.lat;
  }
  helper.getCountry(req, location)
  .then(data=>{
    if(data.err) return next(data.err)
    helper.getCountrySettingsByCountryId(data.country.id)
    .then(newCountrySettings=>res.send(newCountrySettings))
  })
  .catch(err=>next(err));
});

router.put('/not-support', (req, res, next) => {
  db.NonSupportedCountryLead.create(req.body)
  .then(data=>res.send(data))
  .catch(err=>next(err));
});

module.exports = router;
