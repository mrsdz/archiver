const express = require('express');
const router = express.Router();
var Account = require('../models/account')
var jwt = require('jsonwebtoken');

router.post('/', function(req, res) {
    Account.findOne(
        { username: req.body.username },
        (err, user) => {
            if (err) res.flush
        }
    )
    res.redirect('/upload');
});

module.exports = router;