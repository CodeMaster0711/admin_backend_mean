'use strict';

const router = require('express').Router();
const _ = require('underscore');

const db = require('../models');
const middlewares = require('../middlewares');
const Errors = require('../errors');
const dictionary = require('../dictionary.json');
const helper = require('../helper')

router.post('/', middlewares.validateUserSession, (req, res, next) => { //TODO
  const { user }= req;
  const { payment_method_id, bank_name, account, simulated, name } = req.body;

  db.PaymentMethod.findOne({ where: { 'id': payment_method_id } })
    .then(paymentMethod => {
      if (!paymentMethod) return next(new Errors.Validation(dictionary.notValidPaymentMethod));
      db.UserPaymentMethod.create({
        user_id: user.id,
        status: dictionary.notVerifyStatus,
        name,
        bank_name,
        payment_method_id,
        account
      })
        .then(userPaymentMethod => {
          if (simulated) {
            db.SimBankAccount.create({
              type: 'credit',
              amount: 0,
              user_payment_method_id: userPaymentMethod.id,
              user_id: user.id
            })
              .then((simBankAccount) => helper.validateBank(simBankAccount))
              .then(() => res.send(true))
              .catch(err => res.send({ err: err.message }))
          } else {
            res.send(true)
          }
        })
        .catch(err => res.send({ err: err.message }))
    })
    .catch(err => res.send({ err: err.message }))
});

router.put('/update', middlewares.validateUserSession, (req, res, next) => {
  const {user} = req;
  const { payment_method_id, bank_name, account, name, id } = req.body;
  if (!id) return next(new Errors.Validation(dictionary.emptyId));

  db.UserPaymentMethod.findOne({ where: { id, user_id: user.id } })
    .then(userPaymentMethod => {
      if (!userPaymentMethod) return next(new Errors.Validation(dictionary.notFoundUserPaymentMethod));

      userPaymentMethod.PaymentMethodId = payment_method_id ? payment_method_id : userPaymentMethod.PaymentMethodId;
      userPaymentMethod.bank_name = bank_name ? bank_name : userPaymentMethod.bank_name;
      userPaymentMethod.account = account ? account : userPaymentMethod.account;
      userPaymentMethod.name = name ? name : userPaymentMethod.name;
      userPaymentMethod.status = dictionary.notVerifyStatus;

      return userPaymentMethod.save()
        .then(userPaymentMethod => res.send(userPaymentMethod))
    })
    .catch(err => res.send({ err: err.message }));
});


module.exports = router;
