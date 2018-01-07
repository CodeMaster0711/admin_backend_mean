'use strict'
const _ = require('underscore');
const publicIp = require('public-ip');
const geoip = require('geoip-lite');
const NodeGeocoder = require('node-geocoder');

const db = require('../models');

module.exports = (country_code) => {
 
    return db.Country.findOne({
      attributes: ['id', 'name', 'country_code'],
      where: { country_code: country_code, status: 1 },
  raw: true,
    })
      .then((country) => {

        if (country) {
          return { status: true, country }
        } else {
          return { status: false }
        }
      })
      .catch(err => {
      
        err: err.message
      });
};
