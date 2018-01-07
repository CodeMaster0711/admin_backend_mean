'use strict';

module.exports = function(sequelize, DataTypes) {
  const UserPaymentMethod = sequelize.define('UserPaymentMethod', {
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    sim_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    bank_name: DataTypes.STRING
  },{
    underscored: true
  });

  return UserPaymentMethod;
};
