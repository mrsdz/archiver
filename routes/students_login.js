const express = require('express');
const router = express.Router();
var passport = require('passport');
var Account = require('../models/account')

router.post('/', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
    res.redirect('/upload');
});

module.exports = router;