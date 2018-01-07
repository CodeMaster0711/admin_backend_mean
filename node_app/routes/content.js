'use strict';

const router = require('express').Router();

router.post('/improve-score', (req, res, next) => {
    res.send("<p> Tips to improve your score</p>")
});

router.get('/close_loan', (req, res, next) => {
    res.send("<p> Loan is close</p>")
});

router.get('/delete_account', (req, res, next) => {
    res.send("<p>Delete account</p>")
});

router.get('/default', (req, res, next) => {
    res.send("<p>Your account is blocked</p>")
});

module.exports = router;
