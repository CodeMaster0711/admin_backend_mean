'use strict';

module.exports = function(sequelize, DataTypes) {
  const LoansHistory = sequelize.define('LoansHistory', {
    bank_id : DataTypes.STRING,
    date_taken: DataTypes.DATE,
    ammount_taken: DataTypes.DOUBLE,
    service_fee: DataTypes.STRING,
    interest_rate : DataTypes.STRING,
    duration_of_loan: DataTypes.INTEGER,
    status: DataTypes.STRING,
    date: DataTypes.DATE,
    amount_pending: DataTypes.DOUBLE,
    bank_credit_transaction : DataTypes.STRING,
    bank_credit_status: DataTypes.BOOLEAN,
    currency: DataTypes.STRING
  },{
    underscored: true
  });

  return LoansHistory;
};
