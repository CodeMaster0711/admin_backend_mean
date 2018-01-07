'use strict';

module.exports = function(sequelize, DataTypes) {
  const CountrySetting = sequelize.define('CountrySetting', {
    name:{
      type: DataTypes.STRING
    },
    value:{
      type: DataTypes.TEXT
    }
  },{
    underscored: true
  });

  return CountrySetting;
};


// phone_code: {
//   type: DataTypes.INTEGER,
//   allowNull: true
// },
// phone_code_min_length: {
//   type: DataTypes.INTEGER
// },
// phone_code_max_length: {
//   type: DataTypes.INTEGER
// },
// min_age: {
//   type: DataTypes.INTEGER
// },
// currency: {
//   type: DataTypes.STRING,
//   allowNull: true
// },
// currency_symbol: {
//   type: DataTypes.STRING,
//   allowNull: true
// },
// algo_id: {
//   type: DataTypes.INTEGER,
//   allowNull: true
// },
// interest_rate: {
//   type: DataTypes.STRING,
//   allowNull: true
// },
// service_fee: {
//   type: DataTypes.TEXT,
//   allowNull: true
// },
// language: DataTypes.STRING,
// min_loan_amount: DataTypes.DOUBLE,
// max_loan_amount: DataTypes.DOUBLE,
// calc_logic: DataTypes.STRING,
// min_percent_for_user: DataTypes.INTEGER,
// slider_increment_value: DataTypes.INTEGER,
// start_date_increment: DataTypes.INTEGER,
// service_fee_Calc: DataTypes.STRING,
// payment_terms_loan_range: DataTypes.STRING,
// total_loan_val_calc: DataTypes.STRING,
// max_per_user_loan: DataTypes.INTEGER
// });
