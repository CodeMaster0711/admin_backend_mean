'use strict';

module.exports = function(sequelize, DataTypes) {
  const PaymentMethod = sequelize.define('PaymentMethod', {
    name: DataTypes.STRING,
    settings: DataTypes.STRING,
    type: DataTypes.ENUM('bank', 'wallet'),
    status: DataTypes.STRING,
    logo: DataTypes.STRING,
    bank_code: DataTypes.STRING,
  },{
    underscored: true
  });

  return PaymentMethod;
};
