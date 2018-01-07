'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Countries', [{
      name: 'some country',
      country_code: 'SG',
      status: 1
    }, {
      name: 'ukraine',
      country_code: 'UA',
      status: 1
    }]);
  },

  down: function (queryInterface, Sequelize) {
   /* return queryInterface.sequelize.bulkDelete('Countries', {where: {
        $or: [
        {country_code:'SG'},
        {country_code: 'UA'}
      ]
    }})*/
  }
};
