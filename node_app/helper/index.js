'use strict'
const _ = require('underscore');
const publicIp = require('public-ip');
const geoip = require('geoip-lite');
const NodeGeocoder = require('node-geocoder');
const db = require('../models');
const Promise = require('bluebird');
const Errors = require('../errors');
var serialize = require('node-serialize');

var fs = require('fs');
var config;
if (fs.existsSync('./config/config_prod.json')) {
    // Do something
    console.log('prod config picked1');
    config = require('./config/config_prod');
}
else if (fs.existsSync('./config/config_stage.json')) {
    // Do something
    console.log('stage config picked1');
    config = require('../config/config_stage');
}
else
{
  console.log('Dev/Local config picked1');
  config = require('../config/config');
}
const redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
console.log("Trying to connect to REDIS ",config.REDIS_HOST);
const client = redis.createClient(config.REDIS_PORT,config.REDIS_HOST);
client.on("error", function (err) {
    console.log('redis in error',err);
    
  });
client.on('connect', function(result) {
    console.log("redis connected",result);
   });
const dictionary = require('../dictionary.json');

const findCountry = require('./countryHelper')

//todo set to strings file
const monthNames = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"
];

module.exports = {
  getCountry: (req, gps) => {
   //  console.log('Entered get country',req,gps);
    if (gps) {
console.log("entered gps",gps);
return client.getAsync(serialize.serialize(gps,true)).then(function (data1) {
 

        if (data1 != null) {
          console.log("picked up gps in redis");
            return serialize.unserialize(data1);
        } else {



      const { lon, lat } = gps
      const geocoder = NodeGeocoder(config.googleGeocoder);

      return geocoder.reverse({ lat, lon })
        .then((result) => {
          const { countryCode, country } = result[0]
          if (!countryCode) return { "err": new Errors.Validation(dictionary.detectCountryErr) };
          return findCountry(countryCode)
            .then(data => {
              if (!data.status){
                data= {
                "err": new Errors.Validation({
                  country,
                  msg: dictionary.notSupportedCountryErr
                })
              };
              } 
              console.log("saved gps in redis");
              client.setex(serialize.serialize(gps,true), 3600, serialize.serialize(data,true));
              return data;
            })
        })
        .catch((err) => {
          console.log('err', err);
          return { "err": new Errors.Validation(dictionary.detectCountryErr) };
        });

        }
    });
    }else if(!_.isEmpty(req.query)){
      console.log("entered query",req.query);
let location;
    location = {};
    location.lon = req.query.lon;
    location.lat = req.query.lat;
    console.log(location)

return client.getAsync(serialize.serialize(location,true)).then( function (data1) {

        if (data1 != null) {
          console.log("picked up location in redis");
            return serialize.unserialize(data1);
        } else {
           
     
const { lon, lat } = location
      const geocoder = NodeGeocoder(config.googleGeocoder);

      return geocoder.reverse({ lat, lon })
        .then((result) => {
          const { countryCode, country } = result[0]
          if (!countryCode) return { "err": new Errors.Validation(dictionary.detectCountryErr) };
          return findCountry(countryCode)
            .then(data => {
              if (!data.status){
                data= {
                "err": new Errors.Validation({
                  country,
                  msg: dictionary.notSupportedCountryErr
                })
              };
              } 
                            console.log("saved location in redis");
              client.setex(serialize.serialize(location,true), 3600, serialize.serialize(data,true));
              return data;
            })
        })
        .catch((err) => {
          console.log('err', err);
          return { "err": new Errors.Validation(dictionary.detectCountryErr) };
        });

     }
    });
    }
else {
  console.log("entered final else",req.query);
      console.log('x-forwarded-for test' );
      if(config.envoirnment=='dev')
      {
var ip="182.19.216.45";
}
else if(config.envoirnment=='stage')
{
  var arr = req.headers['x-forwarded-for'].split(",");
  console.log(arr);
  var ip=arr[0];
}


      if(ip){
return client.getAsync(serialize.serialize(ip,true)).then( function (data1) {
  console.log(data1);

        if (data1 != null) {
          console.log("picked up real ip in redis");
            return serialize.unserialize(data1);
        } else {
           

        const geo = geoip.lookup(ip);
        if (!geo) next(new Errors.Validation(dictionary.detectCountryErr));
        return findCountry(geo.country)
          .then(data => {
            
            if (!data.status) {
            data ={"err": new Errors.Validation({ country: geo.country, msg: dictionary.notSupportedCountryErr })};
            }
            console.log("saved ip in redis",data);
            client.setex(serialize.serialize(ip,true), 3600, serialize.serialize(data,true));
            return data;
          })
           
        }
    });
      }
      return publicIp.v4()
        .then(ip => {
        return  client.getAsync(serialize.serialize(ip,true)).then( function (data1) {
  

        if (data1 != null) {
          console.log("picked up real ip2 in redis");
            return serialize.unserialize(data1);
        } else {
          const geo = geoip.lookup(ip);
          if (!geo) next(new Errors.Validation(dictionary.detectCountryErr));
          return findCountry(geo.country)
            .then(data => {
              if (!data.status){
                data={"err": new Errors.Validation({ country: geo.country, msg: dictionary.notSupportedCountryErr })};
              } 
                            console.log("saved real ip in redis");
              client.setex(serialize.serialize(ip,true), 3600, serialize.serialize(data,true));
              return data
            })
          }
        });
        })
        .catch(err => {
          //console.log('err', err);
          return { "err": new Errors.Validation(dictionary.detectCountryErr) };
        });
    }
  },
  getCountrySettingsByCountryId: (country_id) => {
    return db.CountrySetting.findAll({ where: { country_id } })
      .then(countrySettings => {
        let newCountrySettings = { country_id }
        return Promise.map(countrySettings, setting => {
          if (setting.name === "interest_rate" ||
            setting.name === "service_fee" ||
            setting.name === "payment_terms_loan_range")
            setting.value = JSON.parse(setting.value);
          //if(!(setting.name === "interest_rate" || setting.name === "service_fee"))
          newCountrySettings[setting.name] = setting.value;
          return setting;
        })
          .then(() => newCountrySettings)
      })
      .catch(err => {
        err: err.message
      })
  },
  validateUser: (phoneNumber) => {
    return db.User.findOne({ where: { phone_number: phoneNumber } })
      .catch(err => res.send({ err: err.message }));
  },
  checkPhoneCode: (phoneNumber, countryCode) => {
    console.log('phoneNumber, countryCode', phoneNumber, countryCode)
    if (-1 !== phoneNumber.search('^\\+' + countryCode)) return true;
    else false;
  },
  checkPhoneLength: (phoneNumber, minLen, maxLen) => {
    if (phoneNumber.length >= minLen && phoneNumber.length <= maxLen) return true;
    else false;
  },
  checkEmail: (email) => {
    if (!email) return true;
    return db.User.findOne({ where: { email: email } })
      .then(user => {
        if (user) return true;
        else return false;
      })
      .catch(err => {
        err: err.message
      });
  },
  countLoan: (interest_rate, service_fee, payment_term, apply_loan_amount, collection_day) => {
    // const userInterestRate = _.findWhere(interest_rate, { days: payment_term });
    let greaterPaymentTerm = _.filter(interest_rate, (item) => {
      return (item.days == payment_term && apply_loan_amount >= item.min && apply_loan_amount <= item.max )
    });
    // greaterPaymentTerm = _.sortBy(greaterPaymentTerm, 'days')

    const userInterestRate = greaterPaymentTerm[0];

    if (!userInterestRate)  return { "err": new Errors.Validation(dictionary.rateErr) };
    if (typeof userInterestRate.percentage !== 'number') return { "err": new Errors.Validation(dictionary.percentageErr) };

    const interestFee = userInterestRate.percentage * apply_loan_amount / 100;

    const currentDate = new Date();
    let nextCollectionDay = new Date();
    nextCollectionDay.setDate(collection_day);

    let days;

    if (currentDate > nextCollectionDay) {
      nextCollectionDay.setMonth(nextCollectionDay.getMonth() + 1);
      days = (currentDate - nextCollectionDay) / 86400000;
    } else {
      days = (nextCollectionDay - currentDate) / 86400000;
    }

    let greaterSettingsServiceFeePaymentTerm = _.filter(service_fee, (item) => {
      return item.days >= days
    });
    greaterSettingsServiceFeePaymentTerm = _.sortBy(greaterSettingsServiceFeePaymentTerm, 'days')
    const countrySettingsServiceFee = greaterSettingsServiceFeePaymentTerm[0];
    if (!countrySettingsServiceFee) return { "err": new Errors.Validation("Error in service fee calculate") };

    const serviceFee = countrySettingsServiceFee.percentage * apply_loan_amount / 100;
    const totalLoanValue = apply_loan_amount + interestFee + serviceFee;
    const weeks = Math.round(payment_term / 7);
    const recurringPaymentValue = totalLoanValue / weeks;
    let schedule = {};

    for (let i = 0; i < weeks; i++) {
      const dateStr = nextCollectionDay.getDate() + " " + monthNames[nextCollectionDay.getMonth()] + " " + nextCollectionDay.getFullYear();
      schedule[dateStr] = recurringPaymentValue;
      nextCollectionDay.setDate(nextCollectionDay.getDate() + 7);
    }

    return {
      countryServiceFee: countrySettingsServiceFee, countryInterestFee: userInterestRate, interestFee, serviceFee,
      totalLoanValue, recurringPaymentValue, schedule
    };
  },
  loanDisbursement: (country_id, ammount_taken) => {
    return db.CountryInvestment.findOne({ where: { country_id, status: 'Active' } })
      .then(countryInvestment => {
        if (!countryInvestment) return false;
        if (countryInvestment.amount_available > ammount_taken) return countryInvestment;
        else return false;
      })
      .catch(err => {
        err: err.message
      });
  },
  loanSchedule: (payment_term, collection_day, totalLoanValue) => {
    const weeks = Math.round(payment_term / 7);
    const recurringPaymentValue = totalLoanValue / weeks;

    const currentDate = new Date();
    let nextCollectionDay = new Date();
    nextCollectionDay.setDate(collection_day);
    let days;
    if (currentDate > nextCollectionDay) {
      nextCollectionDay.setMonth(nextCollectionDay.getMonth() + 1);
      days = (nextCollectionDay - currentDate) / 86400000;
    } else {
      days = (currentDate - nextCollectionDay) / 86400000;
    }

    let schedule = [];
    for (let i = 0; i < weeks; i++) {
      let scheduleItem = {}
      scheduleItem.date = nextCollectionDay.toString();
      scheduleItem.amount = recurringPaymentValue;
      schedule.push(scheduleItem);
      nextCollectionDay.setDate(nextCollectionDay.getDate() + 7);
    }
    return schedule;
  },
  checkPaymentTermsLoanRange: (payment_terms_loan_range, apply_loan_amount, payment_term) => {
    const settingsPaymentTerm = _.find(payment_terms_loan_range, item => {
      return apply_loan_amount >= item.min && apply_loan_amount <= item.max
    });

    if (!settingsPaymentTerm) return { "err": new Errors.Validation(dictionary.settingsPaymentTermErr) };

    const settingTerm = _.find(settingsPaymentTerm.terms, item => {
      return item === payment_term
    });
    if (!settingTerm) return { "err": new Errors.Validation("payment_term not valid for apply_loan_amount, avaliable terms are - " + settingsPaymentTerm.terms.join(',')) };
    return true;
  },
  validateBank: (simBankAccount) => {
    return simBankAccount.update({ status: 'Active' })
  }

};
