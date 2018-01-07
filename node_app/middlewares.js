'use strict'
const geoip = require('geoip-lite');
const NodeGeocoder = require('node-geocoder');
var rp = require('request-promise');

const Errors = require('./errors');
const db = require('./models');
const helper = require('./helper');


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
const auth = require('./helper/auth');
const dictionary = require('./dictionary.json')
const fbConnect = 'https://graph.facebook.com/me?fields=email&access_token=';

module.exports = {
    secure :function(req, res, next) {
     // console.log('req.session', req.session.userId)
      //get token https://developers.facebook.com/tools/explorer/?method=GET&path=me%3Ffields%3Did%2Cname&version=v2.9
          var token = req.body.fbToken;
          rp(fbConnect+token)
            .then(response => {
              console.log('response', response)
               response = JSON.parse(response);
               if(response.id) {
                   req.fbId = response.id;
                   next();
               } else {
                   res.send("0");
               }
            })
            .catch(err => res.send({ err: err.message }));
  },
  validateUser: function(req, res, next) {
    if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT')) return next(new Errors.Validation("No user token"));
    const data = auth.verifyJwt(req.headers.authorization.split(' ')[1])
    db.User.findOne({ where: { verified: 1, status: "Active", id: data.id } })
      .then(user => {
          if (user) {
            helper.getCountrySettingsByCountryId(user.country_id)
            .then(countrySettings=>{
              const countUserAge = new Date().getFullYear() - new Date(user.dob).getFullYear();
              if (countUserAge >= countrySettings.min_age) {
                next();
              } else {
               // delete req.session.userId;
                return next(new Errors.Validation("User age not valid"));
              }
            })
          } else {
            return next(new Errors.Validation("User not verified"));
          }

      })
      .catch(err => res.send({ err: err.message }))
  },
  validateUserSession: function(req, res, next) {
    if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT')) return next(new Errors.Validation("No user token"));
    const data = auth.verifyJwt(req.headers.authorization.split(' ')[1])
console.log('user!!!', data)
    db.User.findOne({where: {id: data.id}})
    .then((user) => {
      if (!user) return next(new Errors.Validation("User not exist"));
      req.user = user;
      //console.log('user!!!', user)

      helper.getCountrySettingsByCountryId(user.country_id)
      .then(countrySettings=>{
        req.countrySettings = countrySettings;
        next()
      })
    })
    .catch(err => res.send({ err: err.message }));
  },
    validateUserSession2: function(req, res, next) {
    if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT')) return next(new Errors.Validation("No user token"));
    const data = auth.verifyJwt(req.headers.authorization.split(' ')[1])
console.log('user!!!', data)
    db.User.findOne({where: {id: data.id}})
    .then((user) => {
      if (!user) return next(new Errors.Validation("{\"token\": \"invalid\"}"));
      req.user = user;
      //console.log('user!!!', user)

      helper.getCountrySettingsByCountryId(user.country_id)
      .then(countrySettings=>{
        req.countrySettings = countrySettings;
        next()
      })
    })
    .catch(err => res.send({ err: err.message }));
  },
  errorHandler: function(err, req, res, next) {
    res.status(err.status || 500).send(err.message);
  },
    validateAdminUser: function(req, res, next) {
        if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT')) return next(new Errors.Validation("No user token"));
        const data = auth.verifyJwt(req.headers.authorization.split(' ')[1])
        console.log('user!!!', data)
        db.AdminUser.findOne({where: {id: data.id},
            include: [{
                model: db.Role,
                foreignKey:'role_id',
                as: 'role'
            }]})
            .then((user) => {
            if (!user) return next(new Errors.Validation("User not exist"));
        if (user.role.role_name !== 'admin') return next(new Errors.Validation("you are not a admin")); // todo: check user role
        req.user = user;
        //console.log('user!!!', user)

        helper.getCountrySettingsByCountryId(user.country_id)
            .then(countrySettings=>{
            req.countrySettings = countrySettings;
        next()
    })
    })
        .catch(err => res.send({ err: err.message }));
    },
    validateAdminUserOrSameUser: function(req, res, next) {
        if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT')) return next(new Errors.Validation("No user token"));
        const data = auth.verifyJwt(req.headers.authorization.split(' ')[1])
        console.log('user!!!', data)
        db.AdminUser.findOne({where: {id: data.id},
            include: [{
                model: db.Role,
                foreignKey:'role_id',
                as: 'role'
            }]})
            .then((user) => {
            if (!user) return next(new Errors.Validation("User not exist"));
        if (user.role.role_name !== 'admin' && user.id !== req.params['id']) return next(new Errors.Validation("you are not a admin")); // todo: check user role
        req.user = user;
        //console.log('user!!!', user)

        helper.getCountrySettingsByCountryId(user.country_id)
            .then(countrySettings=>{
            req.countrySettings = countrySettings;
        next()
    })
    })
        .catch(err => res.send({ err: err.message }));
    }
}
