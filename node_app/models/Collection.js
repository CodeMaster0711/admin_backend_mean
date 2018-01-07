'use strict';

module.exports = function(sequelize, DataTypes) {
  const Collection = sequelize.define('Collection', {
    amount : DataTypes.DOUBLE,
    date: DataTypes.DATE,
    currency: DataTypes.STRING,
    retry_date: DataTypes.DATE,
    status : DataTypes.STRING
  },{
    underscored: true
  });

  return Collection;
};