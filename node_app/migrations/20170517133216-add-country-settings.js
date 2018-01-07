'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('CountrySettings', [{
      name: 'phone_code',
      value: '38',
      country_id: 2
    }, {
      name: 'phone_code_min_length',
      value: 8,
      country_id: 2
    }, {
      name: 'phone_code_max_length',
      value: 12,
      country_id: 2
    }, {
      name: 'min_age',
      value: 21,
      country_id: 2
    }, {
      name: 'max_loan_amount',
      value: 2000,
      country_id: 2
    }, {
      name: 'min_loan_amount',
      value: 100,
      country_id: 2
    }, {
      name: 'max_per_user_loan',
      value: 10,
      country_id: 2
    }, {
      name: 'currency',
      value: 'gr',
      country_id: 2
    }, {
      name: 'interest_rate',
      value: JSON.stringify([
        { "min": 100, "max": 150, "days": 21, "percentage": 9 },
        { "min": 100, "max": 150, "days": 35, "percentage": 16.88 },
        { "min": 100, "max": 150, "days": 42, "percentage": false },
        { "min": 151, "max": 200, "days": 21, "percentage": 9 },
        { "min": 151, "max": 200, "days": 28, "percentage": 13.5 },
        { "min": 151, "max": 200, "days": 35, "percentage": 16.88 },
        { "min": 151, "max": 200, "days": 42, "percentage": false },
        { "min": 201, "max": 250, "days": 21, "percentage": 9 },
        { "min": 201, "max": 250, "days": 28, "percentage": 13.5 },
        { "min": 201, "max": 250, "days": 35, "percentage": 16.88 },
        { "min": 201, "max": 250, "days": 42, "percentage": false },
        { "min": 251, "max": 300, "days": 21, "percentage": 9 },
        { "min": 251, "max": 300, "days": 28, "percentage": 13.5 },
        { "min": 251, "max": 300, "days": 35, "percentage": 16.88 },
        { "min": 251, "max": 300, "days": 42, "percentage": false },

        { "min": 301, "max": 350, "days": 21, "percentage": false },
        { "min": 301, "max": 350, "days": 28, "percentage": 8 },
        { "min": 301, "max": 350, "days": 35, "percentage": 12 },
        { "min": 301, "max": 350, "days": 42, "percentage": 15 },

        { "min": 351, "max": 400, "days": 21, "percentage": false },
        { "min": 351, "max": 400, "days": 28, "percentage": 8 },
        { "min": 351, "max": 400, "days": 35, "percentage": 12 },
        { "min": 351, "max": 400, "days": 42, "percentage": 15 },

        { "min": 401, "max": 450, "days": 21, "percentage": false },
        { "min": 401, "max": 450, "days": 28, "percentage": 8 },
        { "min": 401, "max": 450, "days": 35, "percentage": 12 },
        { "min": 401, "max": 450, "days": 42, "percentage": 15 },

        { "min": 451, "max": 500, "days": 21, "percentage": false },
        { "min": 451, "max": 500, "days": 28, "percentage": 8 },
        { "min": 451, "max": 500, "days": 35, "percentage": 12 },
        { "min": 451, "max": 500, "days": 42, "percentage": 15 }]),
      country_id: 2
    }, {
      name: 'service_fee',
      value: JSON.stringify([
        { "days": 21, "percentage": 9 },
        { "days": 35, "percentage": 16.88 },
        { "days": 28, "percentage": 13.5 },
        { "days": 28, "percentage": 8 },
        { "days": 35, "percentage": 12 },
        { "days": 42, "percentage": 15 }
      ]),
      country_id: 2
    }, {
      name: 'payment_terms_loan_range',
      value: JSON.stringify([
        { "min": 100, "max": 300, "terms": [21, 28, 35] },
        { "min": 301, "max": 500, "terms": [28, 35, 42] }]),
      country_id: 2
    }, {
      name: 'collection_day',
      value: 4,
      country_id: 2
    }, {
      name: 'next_retry_day',
      value: 3,
      country_id: 2
    }, {
      name: 'max_per_user_loan_amount',
      value: 800,
      country_id: 2
    }, {
      name: 'penalty',
      value: JSON.stringify([
        { "min": 100, "max": 150, "days": 21, "percentage": 9 },
        { "min": 100, "max": 150, "days": 35, "percentage": 16.88 },
        { "min": 100, "max": 150, "days": 42, "percentage": false },
        { "min": 151, "max": 200, "days": 21, "percentage": 9 },
        { "min": 151, "max": 200, "days": 28, "percentage": 13.5 },
        { "min": 151, "max": 200, "days": 35, "percentage": 16.88 },
        { "min": 151, "max": 200, "days": 42, "percentage": false },
        { "min": 201, "max": 250, "days": 21, "percentage": 9 },
        { "min": 201, "max": 250, "days": 28, "percentage": 13.5 },
        { "min": 201, "max": 250, "days": 35, "percentage": 16.88 },
        { "min": 201, "max": 250, "days": 42, "percentage": false },
        { "min": 251, "max": 300, "days": 21, "percentage": 9 },
        { "min": 251, "max": 300, "days": 28, "percentage": 13.5 },
        { "min": 251, "max": 300, "days": 35, "percentage": 16.88 },
        { "min": 251, "max": 300, "days": 42, "percentage": false },

        { "min": 301, "max": 350, "days": 21, "percentage": false },
        { "min": 301, "max": 350, "days": 28, "percentage": 8 },
        { "min": 301, "max": 350, "days": 35, "percentage": 12 },
        { "min": 301, "max": 350, "days": 42, "percentage": 15 },

        { "min": 351, "max": 400, "days": 21, "percentage": false },
        { "min": 351, "max": 400, "days": 28, "percentage": 8 },
        { "min": 351, "max": 400, "days": 35, "percentage": 12 },
        { "min": 351, "max": 400, "days": 42, "percentage": 15 },

        { "min": 401, "max": 450, "days": 21, "percentage": false },
        { "min": 401, "max": 450, "days": 28, "percentage": 8 },
        { "min": 401, "max": 450, "days": 35, "percentage": 12 },
        { "min": 401, "max": 450, "days": 42, "percentage": 15 },

        { "min": 451, "max": 500, "days": 21, "percentage": false },
        { "min": 451, "max": 500, "days": 28, "percentage": 8 },
        { "min": 451, "max": 500, "days": 35, "percentage": 12 },
        { "min": 451, "max": 500, "days": 42, "percentage": 15 }]),
      country_id: 2
    }, {
      name: 'phone_code',
      value: '65',
      country_id: 1
    }, {
      name: 'phone_code_min_length',
      value: 8,
      country_id: 1
    }, {
      name: 'phone_code_max_length',
      value: 10,
      country_id: 1
    }, {
      name: 'min_age',
      value: 21,
      country_id: 1
    }, {
      name: 'max_loan_amount',
      value: 2000,
      country_id: 1
    }, {
      name: 'min_loan_amount',
      value: 100,
      country_id: 1
    }, {
      name: 'max_per_user_loan',
      value: 10,
      country_id: 1
    }, {
      name: 'currency',
      value: 'sgd',
      country_id: 1
    }, {
      name: 'interest_rate',
      value: JSON.stringify([
        { "min": 100, "max": 150, "days": 21, "percentage": 9 },
        { "min": 100, "max": 150, "days": 35, "percentage": 16.88 },
        { "min": 151, "max": 200, "days": 21, "percentage": 9 },
        { "min": 151, "max": 200, "days": 28, "percentage": 13.5 },
        { "min": 151, "max": 200, "days": 35, "percentage": 16.88 },
        { "min": 201, "max": 250, "days": 21, "percentage": 9 },
        { "min": 201, "max": 250, "days": 28, "percentage": 13.5 },
        { "min": 201, "max": 250, "days": 35, "percentage": 16.88 },
        { "min": 251, "max": 300, "days": 21, "percentage": 9 },
        { "min": 251, "max": 300, "days": 28, "percentage": 13.5 },
        { "min": 251, "max": 300, "days": 35, "percentage": 16.88 },
        { "min": 301, "max": 350, "days": 28, "percentage": 8 },
        { "min": 301, "max": 350, "days": 35, "percentage": 12 },
        { "min": 301, "max": 350, "days": 42, "percentage": 15 },
        { "min": 351, "max": 400, "days": 28, "percentage": 8 },
        { "min": 351, "max": 400, "days": 35, "percentage": 12 },
        { "min": 351, "max": 400, "days": 42, "percentage": 15 },
        { "min": 401, "max": 450, "days": 28, "percentage": 8 },
        { "min": 401, "max": 450, "days": 35, "percentage": 12 },
        { "min": 401, "max": 450, "days": 42, "percentage": 15 },
        { "min": 451, "max": 500, "days": 28, "percentage": 8 },
        { "min": 451, "max": 500, "days": 35, "percentage": 12 },
        { "min": 451, "max": 500, "days": 42, "percentage": 15 }]),
      country_id: 1
    }, {
      name: 'service_fee',
      value: JSON.stringify([
        { "days": 21, "percentage": 9 },
        { "days": 35, "percentage": 16.88 },
        { "days": 21, "percentage": 9 },
        { "days": 28, "percentage": 13.5 },
        { "days": 35, "percentage": 16.88 },
        { "days": 21, "percentage": 9 },
        { "days": 28, "percentage": 13.5 },
        { "days": 35, "percentage": 16.88 },
        { "days": 21, "percentage": 9 },
        { "days": 28, "percentage": 13.5 },
        { "days": 35, "percentage": 16.88 },
        { "days": 28, "percentage": 8 },
        { "days": 35, "percentage": 12 },
        { "days": 42, "percentage": 15 },
        { "days": 28, "percentage": 8 },
        { "days": 35, "percentage": 12 },
        { "days": 42, "percentage": 15 },
        { "days": 28, "percentage": 8 },
        { "days": 35, "percentage": 12 },
        { "days": 42, "percentage": 15 },
        { "days": 28, "percentage": 8 },
        { "days": 35, "percentage": 12 },
        { "days": 42, "percentage": 15 }]),
      country_id: 1
    }, {
      name: 'collection_day',
      value: 4,
      country_id: 1
    }, {
      name: 'payment_terms_loan_range',
      value: JSON.stringify([
        { "min": 100, "max": 300, "terms": [21, 28, 35] },
        { "min": 301, "max": 500, "terms": [28, 35, 42] }]),
      country_id: 1
    }, {
      name: 'max_per_user_loan_amount',
      value: 800,
      country_id: 1
    }, {
      name: 'next_retry_day',
      value: 3,
      country_id: 1
    }, {
      name: 'penalty',
      value: JSON.stringify([
        { "min": 100, "max": 150, "days": 21, "percentage": 9 },
        { "min": 100, "max": 150, "days": 35, "percentage": 16.88 },
        { "min": 151, "max": 200, "days": 21, "percentage": 9 },
        { "min": 151, "max": 200, "days": 28, "percentage": 13.5 },
        { "min": 151, "max": 200, "days": 35, "percentage": 16.88 },
        { "min": 201, "max": 250, "days": 21, "percentage": 9 },
        { "min": 201, "max": 250, "days": 28, "percentage": 13.5 },
        { "min": 201, "max": 250, "days": 35, "percentage": 16.88 },
        { "min": 251, "max": 300, "days": 21, "percentage": 9 },
        { "min": 251, "max": 300, "days": 28, "percentage": 13.5 },
        { "min": 251, "max": 300, "days": 35, "percentage": 16.88 },
        { "min": 301, "max": 350, "days": 28, "percentage": 8 },
        { "min": 301, "max": 350, "days": 35, "percentage": 12 },
        { "min": 301, "max": 350, "days": 42, "percentage": 15 },
        { "min": 351, "max": 400, "days": 28, "percentage": 8 },
        { "min": 351, "max": 400, "days": 35, "percentage": 12 },
        { "min": 351, "max": 400, "days": 42, "percentage": 15 },
        { "min": 401, "max": 450, "days": 28, "percentage": 8 },
        { "min": 401, "max": 450, "days": 35, "percentage": 12 },
        { "min": 401, "max": 450, "days": 42, "percentage": 15 },
        { "min": 451, "max": 500, "days": 28, "percentage": 8 },
        { "min": 451, "max": 500, "days": 35, "percentage": 12 },
        { "min": 451, "max": 500, "days": 42, "percentage": 15 }]),
      country_id: 1
    }]);
  },

  down: function(queryInterface, Sequelize) {
    /*return queryInterface.sequelize.bulkDelete('CountrySettings', {where: {
     $or: [
     {CountryId:1},
     {CountryId: 2}
     ]
     }})*/
  }
};


// {"fname":"hgjghjghj", "mname":"mname",
//   "lname":"lname", "email":"email@google.com",
//   "dob":"1994-01-05 00:00:00", "user_location":"odessa",
//   "access_token":"fghfhfgh", "phone_number":"+380954443344",
//   "accept":"1", "sex":"fm",
//   "accept":"profilepic", "sex":"fm",
//   "relationship":"", "signupByMob": true}
