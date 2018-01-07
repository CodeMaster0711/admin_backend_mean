'use strict';

module.exports = function(sequelize, DataTypes) {
  const CountryInvestment = sequelize.define('CountryInvestment', {
    amount_available: DataTypes.INTEGER,
    status: DataTypes.STRING
  },{
    underscored: true
  });

  return CountryInvestment;
};
