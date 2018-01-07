'use strict'
const _ = require('underscore');
const db = require('../models');

module.exports = {
  collectionVerificationSimAccount: (item, loan, user, collection) => {
    return db.SimBankAccount.find({
      attributes: [[db.sequelize.fn('sum', db.sequelize.col('amount')), 'simBankAccountsSum']],
      where: { type: 'credit', user_id: user.id },
      raw: true
    })
      .then(({ simBankAccountsSum }) => {
        if (simBankAccountsSum > item.amount) {
          const history = _.omit(item.dataValues, 'id');
          console.log('history', history)
          return db.CollectionHistory.create(history)
            .then(() => {
              let loanUpdate = {};
              let userUpdate = {};

              loanUpdate.amount_pending = loan.amount_pending - item.amount;
              userUpdate.available_amount = user.available_amount - item.amount;

              if (loanUpdate.amount_pending <= 0) {
                loanUpdate.status = 'Closed';
                userUpdate.no_of_active_loans = user.no_of_active_loans - 1;
              }

              return Promise.all([
                db.LoansHistory.create(_.omit(loan.dataValues, 'id')),
                loan.update(loanUpdate),
                user.update(userUpdate),
                db.CountryInvestment.findOne({ where: { loan_id: loan.id, status: 'Active' } })
                  .then((countryInvestment) => {
                    countryInvestment.update({ status: "Disabled" });
                    return db.CountryInvestment.create({
                      loan_id: loan.id,
                      status: 'Active',
                      country_id: countryInvestment.country_id,
                      amount_available: countryInvestment.amount_available + item.amount
                    })
                  })
              ])
                .then(() => {

 if(item.status === 'To-be-Collected')
                  {
                      return item.update({ 'status': 'Collected' }).then(() => true)
                  }
                  else
                  {
                      return item.update({ 'status': 'Collected-2' }).then(() => true)
                  }

                })
            })

        } else {
          return db.CollectionHistory.create(_.omit(item.dataValues, 'id'))
            .then(() => {
              if (item.status === 'To-be-Collected') {
                return item.update({ status: 'Need-to-Retry' })
                  .then(() => false)
              }

              return db.CountrySetting.findOne({ where: { country_id: user.country_id, name:'penalty' } })
                .then((country_settings) => {
                  country_settings = JSON.parse(country_settings.value)
                  let penaltyArr = _.filter(country_settings, (item) => {
                    return (item.days === loan.duration_of_loan && loan.amount_pending >= item.min && loan.amount_pending <= item.max )
                  });

                  const penalty = penaltyArr[0].percentage * loan.amount_pending / 100;

                  return Promise.all([
                    user.update({ status: 'Defaulted' }),
                    loan.update({ status: 'Active' }),
                    db.Collection.create({
                      status: 'Full-Collection',
                      amount: loan.amount_pending + penalty,
                      loan_id: loan.id,
                      currency: item.currency,
                      date: new Date(),
                      retry_date: new Date()
                    })
                  ])
                    .then(() => {
                      return collection = _.filter(collection, function(item) {
                        return item.loan_id !== loan.id
                      });
                    })
                    .then(() => {
                      db.Collection.update({ status: 'Defaulted' }, {
                        where: {
                          loan_id: loan.id,
                          status: { $ne: 'Full-Collection' },
                        }
                      })
                        .then(() => false)
                    })
                })

            })
        }
      })
  }
};
