'use strict';

const router = require('express').Router();
const _ = require('underscore');

const db = require('../models');
const middlewares = require('../middlewares');
const Errors = require('../errors');
const dictionary = require('../dictionary.json');
const helper = require('../helper');
const cron = require('../schedules/collectionCrone')

router.post('/openbank', (req, res, next) => {

  db.User.findAll({
  limit: 1,
  where: {
    //your where conditions, or without them if you need ANY entry
  },
  order: [ [ 'id', 'DESC' ]]
}).then(function(entries){
   db.UserPaymentMethod.create({
        user_id: entries[0].id,
        status: 'Active',
        name:'test',
        bank_name:'test',
        payment_method_id:1,
        account:'12323'
      })
        .then(userPaymentMethod => {
          if (true) {
            db.SimBankAccount.create({
              type: 'credit',
              amount: 0,
              user_payment_method_id: userPaymentMethod.id,
              user_id: entries[0].id
            })
              .then((simBankAccount) => helper.validateBank(simBankAccount))
              .then(() => res.send(true))
              .catch(err => res.send({ err: err.message }))
          } else {
            res.send(true)
          }
        })
        .catch(err => res.send({ err: err.message }))
}); 


});


router.post('/issuemoney', (req, res, next) => {

 db.Loan.findOne({  order: [
    // Will escape username and validate DESC against a list of valid direction parameters
    ['id', 'DESC']] })
        .then((loan) => {
          if (!loan) return next(new Errors.Validation("Loan not exist"));
                
                         loan.updateAttributes({status: 'Active'}).then(() => {
                          res.send('issed');
                         });
        })
        .catch(err => next(err));


});


router.post('/firstwithdraw', (req, res, next) => {

    db.Loan.findOne({  order: [
    // Will escape username and validate DESC against a list of valid direction parameters
    ['id', 'DESC']] })
        .then((loan) => {
          if (!loan) return next(new Errors.Validation("Loan not exist"));
                db.Collection.findAll({where: {loan_id: loan.id}})
                    .then(collection => {
                       

                         collection[0].updateAttributes({date: db.sequelize.fn('NOW')}).then(() => {
                         	  cron()
    .then(() => res.send('finish cron'+collection));
                         });
                      
                      
                    })
        })
        .catch(err => next(err));

});



router.post('/firstwithdraw', (req, res, next) => {

    db.Loan.findOne({  order: [
    // Will escape username and validate DESC against a list of valid direction parameters
    ['id', 'DESC']] })
        .then((loan) => {
          if (!loan) return next(new Errors.Validation("Loan not exist"));
                db.Collection.findAll({where: {loan_id: loan.id}})
                    .then(collection => {
                       

                         collection[0].updateAttributes({date: db.sequelize.fn('NOW')}).then(() => {
                         	  cron()
    .then(() => res.send('finish cron'+collection));
                         });
                      
                      
                    })
        })
        .catch(err => next(err));

});




router.post('/secondwithdraw', (req, res, next) => {

    db.Loan.findOne({  order: [
    // Will escape username and validate DESC against a list of valid direction parameters
    ['id', 'DESC']] })
        .then((loan) => {

 return db.SimBankAccount.findAll({
      where: { type: 'credit', user_id: loan.user_id }
    })
      .then( simBankAccount  => {
var i;
      	for(i=0;i<simBankAccount.length;i++)
      	{
      		if(i==simBankAccount.length-1)
      		{
      			simBankAccount[i].updateAttributes({amount:0}).then(()=>{
      			   if (!loan) return next(new Errors.Validation("Loan not exist"));
                db.Collection.findAll({where: {loan_id: loan.id}})
                    .then(collection => {
                       

                         collection[1].updateAttributes({date: db.sequelize.fn('NOW')}).then(() => {
                         	  cron()
    .then(() => res.send('finish cron'+collection));
                         });
                      
                      
                    })
                });
      		}
      		else{
      			simBankAccount[i].updateAttributes({amount:0}).then(()=>{});
      		
      		}
      	}

      	
      })

       
        })
        .catch(err => next(err));

});



router.post('/thirdwithdraw', (req, res, next) => {

    db.Loan.findOne({  order: [
    // Will escape username and validate DESC against a list of valid direction parameters
    ['id', 'DESC']] })
        .then((loan) => {

 return db.SimBankAccount.findAll({
      where: { type: 'credit', user_id: loan.user_id }
    })
      .then( simBankAccount  => {
var i;
      	for(i=0;i<simBankAccount.length;i++)
      	{
      		if(i==simBankAccount.length-1)
      		{
      			simBankAccount[i].updateAttributes({amount:1000}).then(()=>{
      			   if (!loan) return next(new Errors.Validation("Loan not exist"));
                db.Collection.findAll({where: {loan_id: loan.id}})
                    .then(collection => {
                       

                         collection[1].updateAttributes({retry_date: db.sequelize.fn('NOW')}).then(() => {
                         	  cron()
    .then(() => res.send('finish cron'+collection));
                         });
                      
                      
                    })
                });
      		}
      		else{
      			simBankAccount[i].updateAttributes({amount:0}).then(()=>{});
      		
      		}
      	}

      	
      })

       
        })
        .catch(err => next(err));

});




router.post('/fourthwithdraw', (req, res, next) => {

    db.Loan.findOne({  order: [
    // Will escape username and validate DESC against a list of valid direction parameters
    ['id', 'DESC']] })
        .then((loan) => {

 return db.SimBankAccount.findAll({
      where: { type: 'credit', user_id: loan.user_id }
    })
      .then( simBankAccount  => {
var i;
      	for(i=0;i<simBankAccount.length;i++)
      	{
      		if(i==simBankAccount.length-1)
      		{
      			simBankAccount[i].updateAttributes({amount:0}).then(()=>{
      			   if (!loan) return next(new Errors.Validation("Loan not exist"));
                db.Collection.findAll({where: {loan_id: loan.id}})
                    .then(collection => {
                       

                         collection[2].updateAttributes({date: db.sequelize.fn('NOW')}).then(() => {
                         	  cron()
    .then(() => res.send('finish cron'+collection));
                         });
                      
                      
                    })
                });
      		}
      		else{
      			simBankAccount[i].updateAttributes({amount:0}).then(()=>{});
      		
      		}
      	}

      	
      })

       
        })
        .catch(err => next(err));

});

router.post('/fifthwithdraw', (req, res, next) => {

    db.Loan.findOne({  order: [
    // Will escape username and validate DESC against a list of valid direction parameters
    ['id', 'DESC']] })
        .then((loan) => {

 return db.SimBankAccount.findAll({
      where: { type: 'credit', user_id: loan.user_id }
    })
      .then( simBankAccount  => {
var i;
      	for(i=0;i<simBankAccount.length;i++)
      	{
      		if(i==simBankAccount.length-1)
      		{
      			simBankAccount[i].updateAttributes({amount:0}).then(()=>{
      			   if (!loan) return next(new Errors.Validation("Loan not exist"));
                db.Collection.findAll({where: {loan_id: loan.id}})
                    .then(collection => {
                       

                         collection[2].updateAttributes({retry_date: db.sequelize.fn('NOW')}).then(() => {
                         	  cron()
    .then(() => res.send('finish cron'+collection));
                         });
                      
                      
                    })
                });
      		}
      		else{
      			simBankAccount[i].updateAttributes({amount:0}).then(()=>{});
      		
      		}
      	}

      	
      })

       
        })
        .catch(err => next(err));

});


router.post('/reactivate', (req, res, next) => {

    db.User.findOne({where: { status: 'Defaulted'}})
        .then((user) => {
          if (!user) return next(new Errors.Validation("No Defaulted User found"));
              user.status='Active';
              user.available_amount=500;
              user.no_of_active_loans=0;
              user.save()
        .then(user2 => {
           db.Loan.findOne({where: { user_id: user.id,status: 'Active'}})
           .then((loan) => {
loan.status='Closed';
loan.save().then(loan2=>{
res.send('finished');
});
           })
        })
      })
        .catch(err => next(err));

});

router.post('/deleteuser', (req, res, next) => {

    db.User.findOne({  order: [
    // Will escape username and validate DESC against a list of valid direction parameters
    ['id', 'DESC']] })
        .then((user) => {
          user.destroy();
    res.send('finish cron');
      })
        .catch(err => next(err));

});


module.exports = router;