'use strict'
const db = require('../models');
const geoip = require('geoip-lite');
const randomstring = require('randomstring');
const helper = require('../helper');
const sendSms = require('../helper/sendSms');
const auth = require('../helper/auth');
const _ = require('underscore');
const Errors = require('../errors');
const middlewares = require('../middlewares');
const router = require('express').Router();
const dictionary = require('../dictionary.json')

router.get('/', middlewares.validateUser, (req, res, next) => {
    res.send({
        'message': 'valid'
    })
});

router.post('/login-via-fb', middlewares.secure, (req, res, next) => {
    db.User.findOne({
        where: {'fbId': req.fbId}
    }).then((user) => {
        if (!user) return next(new Errors.Validation(dictionary.noUserFindByFbEmail));
        if(user.status === 'Blocked') return next(new Errors.Validation(dictionary.blockedUser));
        res.send({token: auth.createJwt({id: user.id})});
    })
        .catch(err => res.send({err: err.message}))
});

router.post('/login', (req, res, next) => {
    db.User.findOne({
        where: {'access_token': req.body.access_token}
    }).then((user) => {
        if (!user) return next(new Errors.Validation(dictionary.userNoAccesToken));
        if(user.status === 'Blocked') return next(new Errors.Validation(dictionary.blockedUser));
        res.send({token: auth.createJwt({id: user.id})});
    })
        .catch(err => res.send({err: err.message}))
});

/**
 * @api {post} /user User Sign up
 * @apiGroup User
 * @apiDescription Sign up user
 *
 *
 * @apiParam {String} phone user phone number
 * @apiParam {Boolean} signupByMob
 *
 * @apiSuccess {Object} user User object that created
 */
router.post('/', (req, res, next) => {
    const {signupByMob, phone_number, access_token, country_location, fbId} = req.body;

    helper.getCountry(req, country_location)
        .then(data => {
            if (data.err) return next(data.err)
            helper.getCountrySettingsByCountryId(data.country.id)
                .then(countrySettings => {
                    const {phone_code, phone_code_min_length, phone_code_max_length, country_id} = countrySettings;
                    helper.validateUser(phone_number)
                        .then((user) => {
                            if (!(!user && signupByMob)) return next(new Errors.Validation(dictionary.userExists));
                            if (!access_token) return next(new Errors.Validation(dictionary.noToken));
                            if (!helper.checkPhoneCode(phone_number, phone_code)) return next(new Errors.Validation(dictionary.notCountryCode));
                            if (!helper.checkPhoneLength(phone_number, phone_code_min_length, phone_code_max_length)) return next(new Errors.Validation(dictionary.notValidPhoneLength));

                            let query = {
                                phone_number,
                                status: dictionary.pendingStatus,
                                access_token,
                                verified: 0,
                                credit_score: 0,
                                country_id,
                                uScore_status: 'NOT_PROCESSED'
                            };
                            if(fbId) query.fbId = fbId
                            db.User.create(query)
                              .then(user => {
                                  res.send({token: auth.createJwt({id: user.id})});
                              })
                              .catch(err => res.send({err: err.message}))
                        })
                })
        })
});

/**
 * @api {post} /code Code Send
 * @apiGroup User
 * @apiDescription Code Send
 *
 * @apiSuccess {Object} send code answer or error
 */
router.post('/code', middlewares.validateUserSession, (req, res, next) => {
    const {user} = req;
    const varificationCode = randomstring.generate({
      length: 6,
      charset: 'numeric'
    });
    const timeDifference = new Date() - new Date(user.last_attempts_time);
    if (timeDifference < 180000 * 10) {
        if (user.number_of_attempts > 5) return next(new Errors.Validation(dictionary.createCodeError));
        user.update({
            number_of_attempts: ++user.number_of_attempts,
            smscode: varificationCode
        }).then(() => {
            sendSms(user.phone_number, req,varificationCode)
                .then(msg => {
                    res.send(msg)
                })
        })
    } else {
        user.update({
            number_of_attempts: 1,
            last_attempts_time: new Date(),
            smscode: varificationCode
        }).then(() => {
            sendSms(user.phone_number, req,varificationCode).then(msg => {
                res.send(msg)
            })
        })
    }
});

router.post('/verify', middlewares.validateUserSession, (req, res, next) => {

    const {code} = req.body;
    const {user} = req;

    if (!code) return next(new Errors.Validation(dictionary.emptyCode))
    if (code !== user.smscode) return next(new Errors.Validation(dictionary.notMathCode))

    user.update({
        verified: 1
    }).then(() => {
        res.send({
            "message": "done"
        })
    })
});

router.post('/api', (req, res, next) => {

    const {phone_number, fname, mname, lname, email, signupByMob, country_location, dob, access_token,fbId} = req.body;
    let sql = {
        fname,
        mname,
        lname,
        email,
        user_location: req.body.user_location,
        accept: true,
        no_of_active_loans: 0,
        sex: req.body.sex,
        profilepic: req.body.profilepic,
        relationship: req.body.relationship,
        available_amount: 0,
        min_availalble_amount: 0,
        status: 'Active'
    };

    if (signupByMob) {
        if (!req.session.userId) return next(new Errors.Validation(dictionary.noUserSession));
        db.User.findOne({where: {'id': req.session.userId}})
            .then(user => {
                if (!fname || !lname) return next(new Errors.Validation(dictionary.emptyUsername));
                helper.checkEmail(email).then(response => {
                    helper.getCountrySettingsByCountryId(user.country_id)
                        .then(countrySettings => {
                            if (response) return next(new Errors.Validation(dictionary.emailNotValid));
                            //  if (user.phone_number !== phone_number) sql.verified = 0;

                            const countUserAge = new Date().getFullYear() - new Date(user.dob).getFullYear();
                            if (countUserAge < countrySettings.min_age) return next(new Errors.Validation(dictionary.userNotValid));

                            sql.dob = dob;

                            user.update(sql)
                                .then(() => {
                                    res.send(true);
                                })
                        })
                })
            })
            .catch(err => res.send({err: err.message}))
    } else {
         let location;
  console.log('req.query',req.query)
  if(!_.isEmpty(req.query)){
    location = {};
    location.lon = req.query.lon;
    location.lat = req.query.lat;
  }
        helper.getCountry(req, location)
            .then(data => {
                if (data.err) return next(data.err)
                helper.getCountrySettingsByCountryId(data.country.id)
                    .then(countrySettings => {
                        if (!fname || !lname) return next(new Errors.Validation(dictionary.emptyUsername));
                        helper.checkEmail(email)
                            .then(response => {
                                if (response) return next(new Errors.Validation(dictionary.emailNotValid));
                                if (!access_token) return next(new Errors.Validation(dictionary.emptyAccesToken));
                                if (!dob) return next(new Errors.Validation(dictionary.emptyDob));

                                const countUserAge = new Date().getFullYear() - new Date(dob).getFullYear();
                                if (countUserAge < countrySettings.min_age) return next(new Errors.Validation(dictionary.userAgeErr));

                                sql.dob = dob;
                                sql.available_amount=500;
                                sql.min_availalble_amount=100;
                                sql.phone_number = phone_number;
                                sql.access_token = req.body.access_token;
                                sql.uScore_status= 'NOT_PROCESSED'
                                sql.country_id = countrySettings.country_id;
                                if(fbId) sql.fbId = fbId
                                db.User.create(sql).then((user) => {
                                   // req.session.userId = user.id;
                                    res.send(true);
                                })
                            })
                    })
            })
            .catch(err => next(err));
    }
});

router.get('/details', middlewares.validateUserSession, (req, res, next) => {
    db.UserPaymentMethod.findAll({where: {user_id: req.user.id}, raw: true})
        .then(userPaymentMethods => {
            let user = req.user.toJSON();
            userPaymentMethods = userPaymentMethods.map(item => {
                item.account = item.account.substr(-4);
                return item;
            })
            user.user_payment_methods = userPaymentMethods;
            return user;

            return db.Loan.findOne({where: {user_id: req.user.id, status:'Defaulted'}})
            .then(loan => {
              user.amount_to_be_paid = loan.amount_pending;
              return user;
            })
        })
        .then(user=>res.send(user))
        .catch(err => next(err));
});

router.put('/update', middlewares.validateUserSession, (req, res, next) => {
    const {fname, mname, lname, email, dob, user_location, phone_number, sex, relationship, profilepic, terms_accept,id_proof_file,selfie_proof_file,address_proof_file} = req.body;
    const {user} = req;
    if (phone_number && user.phone_number !== phone_number) user.verified = 0;
if (id_proof_file && user.id_proof_file !== id_proof_file) user.id_verification_status = 'NotVerified';
if (address_proof_file && user.address_proof_file !== address_proof_file) user.address_verification_status = 'NotVerified';



    user.fname = fname ? fname : user.fname;
    user.mname = mname ? mname : user.mname;
    user.lname = lname ? lname : user.lname;
    user.email = email ? email : user.email;
    user.id_proof_file= id_proof_file ? id_proof_file : user.id_proof_file;
    user.selfie_proof_file= selfie_proof_file ? selfie_proof_file : user.selfie_proof_file;
    user.address_proof_file= address_proof_file ? address_proof_file : user.address_proof_file;
    

    user.dob = dob ? dob : user.dob;
    user.user_location = user_location ? user_location : user.user_location;
    user.phone_number = phone_number ? phone_number : user.phone_number;
    user.sex = sex ? sex : user.sex;
    user.relationship = relationship ? relationship : user.relationship;
    user.profilepic = profilepic ? profilepic : user.profilepic;
    user.terms_accept = terms_accept ? terms_accept : user.terms_accept;

    user.save()
        .then(user => res.send(user))
        .catch(err => next(err));

});


router.delete('/delete', middlewares.validateUserSession, (req, res, next) => {
    req.user.destroy({})
        .then(() => res.send(true))
        .catch(err => next(err));
});

router.get('/payment-method', middlewares.validateUserSession, (req, res, next) => {
    db.UserPaymentMethod.findAll({where: {user_id: req.user.id}, raw: true})
        .then(userPaymentMethod => {
            //userPaymentMethod.account = userPaymentMethod.account.substr(-4);
            res.send(userPaymentMethod);
        })
        .catch(err => next(err));
});

router.get('/id_address_verify', middlewares.validateUserSession, (req, res, next) => {
    const {user} = req;
  
/* THIS IS WHERE THE ID VERIFICATION LOGIC GOES */
/* THIS IS WHERE THE ID VERIFICATION LOGIC GOES */
/* THIS IS WHERE THE ID VERIFICATION LOGIC GOES */
/* THIS IS WHERE THE ID VERIFICATION LOGIC GOES */

/* THIS IS WHERE THE ID VERIFICATION LOGIC GOES */
/* THIS IS WHERE THE ID VERIFICATION LOGIC GOES */
/* THIS IS WHERE Need to INVOKE USCORE LOGIC */
/* THIS IS WHERE Need to INVOKE USCORE LOGIC */

/* THIS IS WHERE Need to INVOKE USCORE LOGIC */
/* THIS IS WHERE Need to INVOKE USCORE LOGIC */
/* THIS IS WHERE Need to INVOKE USCORE LOGIC */
/* THIS IS WHERE Need to INVOKE USCORE LOGIC */
/* THIS IS WHERE Need to INVOKE USCORE LOGIC */
/* THIS IS WHERE Need to INVOKE USCORE LOGIC */
/* THIS IS WHERE Need to INVOKE USCORE LOGIC */
/* THIS IS WHERE Need to INVOKE USCORE LOGIC */

user.id_verification_status ='Verified';
user.address_verification_status ='Verified';
user.uScore_status ='DONE';


    user.save()
        .then(user => res.send(user))
        .catch(err => next(err));

});

router.post('/check_token', middlewares.validateUserSession2, (req, res, next) => {

    //const {code} = req.body;
    //const {user} = req;

res.send({
            "token": "valid"
        })

    //if (!code) return next(new Errors.Validation(dictionary.emptyCode))
//    if (code !== user.smscode) return next(new Errors.Validation(dictionary.notMathCode))

   
});





module.exports = router;
