'use strict';

module.exports = function(sequelize, DataTypes) {
  const CreditScoreHistory = sequelize.define('CreditScoreHistory', {
    credit_score: DataTypes.DOUBLE,
    date_processed: DataTypes.DATE
  },{
    underscored: true
  });

  return CreditScoreHistory;
};
