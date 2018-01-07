'use strict';

module.exports = function(sequelize, DataTypes) {
  const NonSupportedCountryLead = sequelize.define('NonSupportedCountryLead', {
    country : DataTypes.STRING,
    ip_address: DataTypes.STRING,
    gps_location: DataTypes.STRING,
    email: DataTypes.STRING
  },{
    underscored: true
  });

  return NonSupportedCountryLead;
};
