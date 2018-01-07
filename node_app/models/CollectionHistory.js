'use strict';

module.exports = function(sequelize, DataTypes) {
  const CollectionHistory = sequelize.define('CollectionHistory', {
    amount : DataTypes.DOUBLE,
    date: DataTypes.DATE,
    currency: DataTypes.STRING,
    retry_date: DataTypes.DATE,
    status : DataTypes.STRING,
    date_of_entry: DataTypes.DATE,
    bank_response: DataTypes.STRING
  },{
    underscored: true
  });

  return CollectionHistory;
};
