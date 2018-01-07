'use strict';

const router = require('express').Router();

router.get('/msg', (req, res, next) => {
    res.send("<p> Defaulted messages</p>")
});

module.exports = router;
