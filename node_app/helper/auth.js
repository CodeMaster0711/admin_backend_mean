const jwt = require('jsonwebtoken');
const randomstring = require("randomstring");
var fs = require('fs');
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


module.exports = {
  createJwt: (data) => {
    return jwt.sign(data, config.JWT_SALT, {
       expiresIn: '2h'
   });
 },
  verifyJwt: (jwtString) => {
      return jwt.verify(jwtString, config.JWT_SALT);
  },
  generateToken: () => {
      return randomstring.generate(10);
  }
};
