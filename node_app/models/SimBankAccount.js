'use strict';

module.exports = function(sequelize, DataTypes) {
  const SimBankAccount = sequelize.define('SimBankAccount', {
    type: DataTypes.ENUM('credit', 'debit'),
    amount: DataTypes.STRING
  },{
    underscored: true
  });

  return SimBankAccount;
};

