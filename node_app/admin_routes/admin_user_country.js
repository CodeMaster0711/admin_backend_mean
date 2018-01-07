'use strict';

const router = require('express').Router();
const _ = require('underscore');

const db = require('../models');
const middlewares = require('../middlewares');
const Errors = require('../errors');
const dictionary = require('../dictionary.json');
const helper = require('../helper')


router.get('/', middlewares.validateAdminUser, (req, res, next) => {
    db.AdminuserCountry.find().then((adminuserCountries) => {
        res.send(adminuserCountries);
});
    });

router.get('/:id', middlewares.validateAdminUser, (req, res, next) => {
    db.AdminuserCountry.findOne({where: {'id': req.params.id}}).then((adminuserCountry) => {
        res.send(adminuserCountry);
});
});


router.post('/', middlewares.validateAdminUser, (req, res, next) => {
    const {adminuser_id, country_id} = req.body;

    db.AdminuserCountry.findOne({where: {'id': payment_method_id}}).then((paymentMethod) => {});
});

router.put('/', middlewares.validateAdminUser, (req, res, next) => {
    const {adminuser_id, country_id} = req.body;

    db.AdminuserCountry.findOne({where: {'id': payment_method_id}}).then((paymentMethod) => {});
});


router.delete('/', middlewares.validateAdminUser, (req, res, next) => {
    const {user} = req;
const {payment_method_id, bank_name, account, simulated, name} = req.body;

db.AdminuserCountry.findOne({where: {'id': payment_method_id}}).then((paymentMethod) => {});
});