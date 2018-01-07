'use strict';

const Promise = require('bluebird');
const _ = require('underscore');

const db = require('../models');
const helper = require('./helpers');

module.exports = function() {
  const today = new Date();
  const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 0, 0, 0);

  return db.Collection.findAll({
    where: {
      $or: [
        { $and: [{ date: { $gte: dayStart } }, { date: { $lte: dayEnd } }, { status: 'To-be-Collected' }] },
        { $and: [{ retry_date: { $gte: dayStart } }, { retry_date: { $lte: dayEnd } }, { status: 'Need-to-Retry' }] },
        { status: 'Full-Collection' }
      ]
    }
  })
    .then(collections => {
      if (!collections) return;
      return Promise.map(collections, item => {
        return Promise.all([
          db.Collection.update({status: 'Processing'}, { where: { id:item.id }}),
          db.Loan.findOne({ where: { id: item.loan_id } })
        ])
          .then(([, loan]) => {
            return Promise.props({
              userPaymentMethod: db.UserPaymentMethod.findOne({ where: { user_id: loan.user_id } }),
              user: db.User.findOne({ where: { id: loan.user_id } })
            })
              .then(({ userPaymentMethod, user }) => {
                return db.SimBankAccount.findOne({
                  where: {
                    user_payment_method_id: userPaymentMethod.id,
                    user_id: loan.user_id
                  }
                })
                  .then((simBankAccount) => {
                    if (!simBankAccount) return;
                    return helper.collectionVerificationSimAccount(item, loan, user, collections)
                  })
                  .then((validation)=> {
                    if(validation){
                      return db.SimBankAccount.create({
                        user_id: loan.user_id,
                        type: 'debit',
                        amount: item.amount,
                        user_payment_method_id: userPaymentMethod.id
                      });
                    }

                    return;
                  })
              })
          })
      })
        .catch(err => console.log('err', err))

    });
};
