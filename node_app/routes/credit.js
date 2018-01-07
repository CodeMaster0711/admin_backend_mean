'use strict';

const router = require('express').Router();
const _ = require('underscore');
const Promise = require('bluebird');

const db = require('../models');
const middlewares = require('../middlewares');
const Errors = require('../errors');
const helper = require('../helper');
const sendMail = require('../helper/sendMail');
const dictionary = require('../dictionary.json')

const cron = require('../schedules/collectionCrone')


router.get('/analysis', middlewares.validateUser, middlewares.validateUserSession, (req, res, next) => {
    res.send(true);
});

router.get('/status', middlewares.validateUser, middlewares.validateUserSession, (req, res, next) => {
      const {user} = req;
      console.log("Who is this user",req.id);
    db.User.findOne({
        attributes: ['available_amount', 'min_availalble_amount'],
        where: {
            id: user.id,
            available_amount: {$gt: 0}
        }
    })
        .then(data => {
            if (!data) return next(new Errors.Validation("Validation failed"+data));
            const {available_amount, min_availalble_amount} = data;
            res.send({available_amount, min_availalble_amount});
        })
        .catch(err => next(err));
});

router.get('/options', (req, res, next) => {
    helper.getCountry(req)
        .then(data => {
            if (data.err) return next(data.err)

            db.PaymentMethod.findAll({country_id: data.country.id,status: 'Active'})
                .then((result) => {
                    res.send(result)
                })
        })
        .catch(err => next(err));
});

router.get('/available', middlewares.validateUser, middlewares.validateUserSession, (req, res, next) => {
    const {user} = req;

    if (user.no_of_active_loans <= req.countrySettings.max_per_user_loan && user.available_amount > 0 &&
        user.uScore_status == "DONE" && user.id_proof_file !="" && user.selfie_proof_file != "" &&
        user.address_proof_file != "" && user.id_verification_status=='Verified' &&
        user.address_verification_status =='Verified') {
        res.send({available_amount: user.available_amount, min_availalble_amount: user.min_availalble_amount});
    } else {
        return next(new Errors.Validation("Validation failed"));
    }
});

router.post('/calculate', middlewares.validateUserSession,(req, res, next) => {

    const { countrySettings } = req;
    const {apply_loan_amount, payment_term} = req.body;
    const {
          max_loan_amount, min_loan_amount, collection_day, interest_rate, service_fee,
          payment_terms_loan_range, max_per_user_loan_amount
    } = countrySettings;

    if (apply_loan_amount > max_per_user_loan_amount) return next(new Errors.Validation(`apply_loan_amount shoud be less then ${max_per_user_loan_amount} acording country settings`));

    const checkPaymentTermsLoanRange = helper.checkPaymentTermsLoanRange(payment_terms_loan_range, apply_loan_amount, payment_term);
    if (checkPaymentTermsLoanRange.err) return next(checkPaymentTermsLoanRange.err)
    if (!(apply_loan_amount <= max_loan_amount && apply_loan_amount >= min_loan_amount))
          return next(new Errors.Validation("Validation failed, apply_loan_amount not correct for user country"));

    const data = helper.countLoan(interest_rate, service_fee, payment_term, apply_loan_amount, collection_day);
    if (data.err) return next(data.err);

    res.send(data)
});

router.post('/apply', middlewares.validateUserSession, (req, res, next) => {
    const {user} = req;
    const {apply_loan_amount, payment_term, user_payment_method_id} = req.body;
    const {
        max_per_user_loan, max_loan_amount, min_loan_amount, collection_day, currency,
        interest_rate, service_fee, payment_terms_loan_range, max_per_user_loan_amount
    } = req.countrySettings;

    if (!user.email) return next(new Errors.Validation("User does not have email"));
    //if (!user_payment_method_id) return next(new Errors.Validation("missed parameter user_payment_method_id"));
    if (apply_loan_amount > max_per_user_loan_amount) return next(new Errors.Validation(`apply_loan_amount shoud be less then ${max_per_user_loan_amount} acording country settings`));

    const checkPaymentTermsLoanRange = helper.checkPaymentTermsLoanRange(payment_terms_loan_range, apply_loan_amount, payment_term);
    if (checkPaymentTermsLoanRange.err) return next(checkPaymentTermsLoanRange.err)

    if (!(user.no_of_active_loans <= max_per_user_loan &&
        user.available_amount > 0 && apply_loan_amount <= user.available_amount &&
        apply_loan_amount >= user.min_availalble_amount &&
        apply_loan_amount <= max_loan_amount && apply_loan_amount >= min_loan_amount &&
        user.uScore_status == "DONE" && user.id_proof_file !="" && user.selfie_proof_file != "" &&
        user.address_proof_file != "" && user.id_verification_status=='Verified' &&
        user.address_verification_status =='Verified'))
        return next(new Errors.Validation("Validation failed/pending" ));

    const data = helper.countLoan(interest_rate, service_fee, payment_term, apply_loan_amount, collection_day);
    if (data.err) return next(data.err);

    db.Loan.findOne({where: {user_id: user.id, status: 'To be Processed'}})
        .then((value) => {
            if (value) return next(new Errors.Validation("User have processed loan"));

            /*db.UserPaymentMethod.findOne({
                where: {
                    status: "Active",
                    id: user_payment_method_id,
                    user_id: user.id
                }
            })*/
               // .then((userPaymentMethod) => {
                   // if (!userPaymentMethod) return next(new Errors.Validation("Invalid payment method/Bank details"));
                    const sql = {
                        ammount_taken: apply_loan_amount,
                        duration_of_loan: payment_term,
                        currency,
                        date_taken: new Date(),
                        status: 'To be Processed',
                        service_fee: data.serviceFee,
                        interest_rate: data.interestFee,
                        bank_credit_transaction: 0,
                        bank_credit_status: 'Not yet processed',
                        user_id: user.id,
                        amount_pending: data.totalLoanValue
                    };

                    db.Loan.create(sql)
                        .then((loan) => {
                            sendMail(user.email, 'Loan status', 'Your loan is under processing');
                            res.send({loan_id: loan.id})
                        })
                //})
        })
        .catch(err => next(err));

});

router.post('/process', middlewares.validateUserSession, (req, res, next) => {
    const {loan_id} = req.body;
    const {user} = req;
    const {collection_day, currency, next_retry_day, country_id, max_per_user_loan} = req.countrySettings;

    db.Loan.findOne({where: {id: loan_id, status: 'To be Processed', user_id: user.id}})
        .then((loan) => {
            if (!loan) return next(new Errors.Validation(dictionary.notExistLoan));
            if (user.available_amount - loan.ammount_taken < 0) return next(new Errors.Validation("Not enougth user available_amount"));

            helper.loanDisbursement(country_id, loan.ammount_taken)
                .then(countryInvestment => {
                    if (!countryInvestment) return next(new Errors.Validation(" country_investment does not has enough available amount"));

                   // if (loan.user_payment_method_id === null) return next(new Errors.Validation("UserPaymentMethodId is empty"));
                    if (user.no_of_active_loans > max_per_user_loan) return next(new Errors.Validation("user limit number of active loan"));

                    db.SimBankAccount.create({
                        type: 'credit',
                        amount: loan.ammount_taken,
                        user_payment_method_id: 0,
                        user_id: user.id
                    })
                        .then(simBankAccount => {
                            loan.bank_credit_status = 'Transferred';
                            loan.bank_credit_transaction = simBankAccount.id;
                            loan.status = "To-be-Given";

                            return loan.save();
                        })
                        .then(() => {
                            const amount_available = countryInvestment.amount_available - loan.ammount_taken
                            return db.CountryInvestment.update({status: "Disabled"}, { where: { country_id, status: 'Active', loan_id } })
                                .then(() => {
                                    return db.CountryInvestment.create({
                                        amount_available,
                                        status: "Active",
                                        country_id,
                                        loan_id
                                    })
                                        .then(() => {
                                            const user_amount_available = user.available_amount - loan.ammount_taken
                                            const no_of_active_loans = user.no_of_active_loans + 1;
                                            return user.update({
                                                available_amount: user_amount_available,
                                                no_of_active_loans
                                            })
                                        })
                                })

                        })
                        .then(() => {
                            //const totalLoanValue = loan.ammount_taken + loan.service_fee + loan.interest_rate;
                            const paySchedule = helper.loanSchedule(loan.duration_of_loan, collection_day, loan.amount_pending);
                            Promise.map(paySchedule, item => {
                                const {amount, date} = item;
                                const colllectionDate = new Date(date);
                                const newDay = colllectionDate.getDate() + Number(next_retry_day);
                                const retry_date = colllectionDate.setDate(newDay);

                                return db.Collection.create({
                                    amount: parseFloat(amount.toFixed(2)),
                                    date,
                                    currency,
                                    retry_date,
                                    status: 'To-be-Collected',
                                    loan_id
                                })
                            })
                                .then(() => {
                                    sendMail(user.email, 'Loan status', 'Your loan loan has been processed');
                                    res.send(true);
                                })
                        })
                })
        })
        .catch(err => next(err));
});

router.get('/', middlewares.validateUserSession, (req, res, next) => {
    const {loan_id, status} = req.query;
      const {user} = req;
    let sql = {user_id: user.id};

    if (status) sql.status = status;
    //else sql.status = 'Inactive';

    var d = new Date();
    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000*req.countrySettings.offset));

    if (loan_id) {
        sql.id = loan_id;

        db.Loan.findOne({where: sql, raw: true})
            .then((loan) => {
                if (!loan) return next(new Errors.Validation("Loan not exist"));
                db.Collection.findAll({where: {loan_id: loan.id,status:{$ne: 'Defaulted'}}})
                    .then(collection => {
                        loan.collection = collection;
                        loan.current_time = nd;
                        res.send(loan);
                    })
            })
            .catch(err => res.send({err: err.message}))
    } else {
        db.Loan.findAll({where: sql, raw: true})
            .then((loans) => {
                Promise.map(loans, loan => {
                    return db.Collection.findAll({where: {loan_id: loan.id,status:{$ne: 'Defaulted'}}})
                        .then(collection => {
                            loan.collection = collection;
                            loan.current_time = nd;
                            return loan;
                        })
                })
                    .then(loans => {
                        res.send(loans);
                    })
            })
            .catch(err => res.send({err: err.message}))
    }

});

router.get('/cron', (req, res, next) => {
    cron()
    .then(() => res.send('finish cron'));
});

module.exports = router;
