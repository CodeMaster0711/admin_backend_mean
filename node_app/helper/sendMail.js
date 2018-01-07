'use strict'
const nodemailer = require('nodemailer');

const config = require('../config/config');

module.exports = (to, subject, text) => {

  let transporter = nodemailer.createTransport(config.mail, { from: '"Umbrella Inc." <no-reply@getadd.io>' });
  let message = {
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log('error', error.message);
      return;
    }
    console.log('Server responded with "%s"', info.response);
    transporter.close();
  });

};
