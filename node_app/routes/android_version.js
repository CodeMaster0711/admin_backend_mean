'use strict';

const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send("{latest:0.1}");
});


module.exports = router;
