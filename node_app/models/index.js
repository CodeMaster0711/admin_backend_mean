'use strict';

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const lodash = require('lodash')

const Errors = require('../errors');

var config;
if (fs.existsSync('./config/config_prod.json')) {
    // Do something
    console.log('prod config picked3');
    config = require('../config/config_prod');
}
else if (fs.existsSync('./config/config_stage.json')) {
    // Do something
    console.log('stage config picked3');
    config = require('../config/config_stage');
}
else
{
  console.log('Dev/Local config picked3');
  config = require('../config/config');
}
let db = {};
const { name, user, pass, host, port } = config.db;

const sequelize = new Sequelize(name, user, pass, { host, port, dialect: 'mysql'});

fs.readdirSync(__dirname)
  .filter((file) => {
    return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'));
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db);
  }
});


// describe relationships

db['User'].belongsTo(db['Country']);
db['Country'].hasMany(db['User']);

db['CountrySetting'].belongsTo(db['Country']);
db['Country'].hasMany(db['CountrySetting']);

db['CountryInvestment'].belongsTo(db['Country']);
db['Country'].hasMany(db['CountryInvestment']);
db['CountryInvestment'].belongsTo(db['Loan']);
db['Loan'].hasMany(db['CountryInvestment']);

db['UserPaymentMethod'].belongsTo(db['User']);
db['User'].hasMany(db['UserPaymentMethod']);

db['PaymentMethod'].belongsTo(db['Country']);
db['Country'].hasMany(db['PaymentMethod']);

db['UserPaymentMethod'].belongsTo(db['User']);
db['User'].hasMany(db['UserPaymentMethod']);
db['UserPaymentMethod'].belongsTo(db['PaymentMethod']);
db['PaymentMethod'].hasMany(db['UserPaymentMethod']);

db['SimBankAccount'].belongsTo(db['UserPaymentMethod']);
db['UserPaymentMethod'].hasMany(db['SimBankAccount']);
db['SimBankAccount'].belongsTo(db['User']);
db['User'].hasMany(db['SimBankAccount']);

db['CreditScoreHistory'].belongsTo(db['User']);
db['User'].hasMany(db['CreditScoreHistory']);

db['Loan'].belongsTo(db['User']);
db['User'].hasMany(db['Loan']);
db['Loan'].belongsTo(db['UserPaymentMethod']);
db['UserPaymentMethod'].hasMany(db['Loan']);

db['LoansHistory'].belongsTo(db['User']);
db['User'].hasMany(db['LoansHistory']);

db['Collection'].belongsTo(db['Loan']);
db['Loan'].hasMany(db['Collection']);

db['CollectionHistory'].belongsTo(db['Loan']);
db['Loan'].hasMany(db['CollectionHistory']);

db['Company'].belongsTo(db['Country']);
db['Country'].hasMany(db['Company']);


db['AdminUser'].belongsTo(db['Company']);
db['Company'].hasMany(db['AdminUser']);

db['AdminUser'].belongsTo(db['Role'], {foreignKey: "role_id", as: "role"});
db['Role'].hasMany(db['AdminUser']);

db['AdminuserCountry'].belongsTo(db['AdminUser']);
db['AdminUser'].hasMany(db['AdminuserCountry']);

db['AdminuserCountry'].belongsTo(db['Country']);
db['Country'].hasMany(db['AdminuserCountry']);

db['DistributionCenter'].belongsTo(db['Country']);
db['Country'].hasMany(db['DistributionCenter']);

db['DistributionCenter'].belongsTo(db['Company']);
db['Company'].hasMany(db['DistributionCenter']);

db['FeatureACL'].belongsTo(db['Role']);
db['Role'].hasMany(db['FeatureACL']);

db['UserActivityLog'].belongsTo(db['AdminUser']);
db['AdminUser'].hasMany(db['UserActivityLog']);

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);

