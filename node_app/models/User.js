'use strict';

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    fname: DataTypes.STRING,
    mname: DataTypes.STRING,
    lname: DataTypes.STRING,
    email: DataTypes.STRING,
    dob: DataTypes.DATE,
    user_location: DataTypes.STRING,
    access_token: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    verified:{
      type:DataTypes.BOOLEAN,
      defaultValue: 0
     },
    accept: DataTypes.INTEGER,
    no_of_active_loans: DataTypes.DOUBLE,
    status: DataTypes.STRING,
    sex: DataTypes.STRING,
    profilepic: DataTypes.STRING,
    relationship: DataTypes.STRING,
    available_amount: DataTypes.DOUBLE,
    min_availalble_amount:{
       type: DataTypes.DOUBLE,
       defaultValue: 0
     },
    number_of_attempts: {
      type: DataTypes.INTEGER(1),
      defaultValue: 0
    },
    last_attempts_time: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    umbrella_score: {
       type: DataTypes.DOUBLE,
       defaultValue: 0
     },
    fbId: DataTypes.STRING,
   smscode: DataTypes.STRING,
   uScore_status: DataTypes.STRING,
   id_proof_file: DataTypes.STRING,
   selfie_proof_file: DataTypes.STRING,
   address_proof_file: DataTypes.STRING,
   id_verification_status: DataTypes.STRING,
   address_verification_status: DataTypes.STRING
  },{
      underscored: true
  });

  return User;

};
