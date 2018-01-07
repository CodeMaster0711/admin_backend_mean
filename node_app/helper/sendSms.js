'use strict'
const Nexmo = require('nexmo');
const Promise = require('bluebird');


const config = require('../config/config');

const { apiKey, apiSecret } = config.nexmo;
const nexmo = new Nexmo({ apiKey, apiSecret });
var AWS = require('aws-sdk');
module.exports = (phone, req,varificationCode) =>{



  return new Promise(function(resolve, reject) {
var mess="Umbrella Verification Code: " + varificationCode

var params = {
        Message: mess, /* required */
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                      'DataType': 'String',
                      'StringValue': 'Umbrella'   
                }    
        },
        PhoneNumber: phone,
        Subject: 'Umbrella',
        //TargetArn: 'arn:aws:sns:us-west-2:798298080689:SMS',
        //TopicArn: 'arn:aws:sqs:us-west-2:798298080689:SendSMS'
    };
    AWS.config.update({
    accessKeyId: config.AWS.accessKeyId,
    secretAccessKey: config.AWS.secretAccessKey,
    "region": config.AWS.region   
});
    var sns = new AWS.SNS({apiVersion: config.AWS.apiVersion,region: config.AWS.region});
    sns.publish(params, function(err, data) {
        if (err) {
        console.log(err, err.stack);
        return resolve({ "error": err });
        } // an error occurred
        else    { console.log(data); 
        return resolve({ "message": "done" ,"code": varificationCode}); 
        }         // successful response
    });




    console.log('varificationCode', varificationCode);
   /* nexmo.message.sendSms("15037555597", phone, mess,{}, function(err, message) {
      console.log('res', err, message);
       if(err) return Promise.resolve({ "error": res.messages[0]['error-text'] });
       if(message.messages[0].status === '0') {
        // req.session.varificationCode = varificationCode;
         return resolve({ "message": "done" ,"code": varificationCode});
       }else{
         return resolve({ "error": message.messages[0]['error-text'] });
       }

      // req.session.varificationCode = varificationCode;
      // return resolve({ "message": "cant connect nexmo. code " + varificationCode });
    })*/
  });


};
