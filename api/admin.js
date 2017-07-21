const express = require('express');
const app = express;
const router = express.Router();
var Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
/*
    this file isn't in github repository and you should add this manually like this:
    module.exports = {
        'secret': "this is top secret",
    };
*/
const config = require('../config')

router.post('/login/', (req, res) => {
    if (!(req.body.username && req.body.password))
        return res.json({ "error": "اطلاعات وارد شده ناقص است." });
    console.log(req.body.username)
    Admin.findOne(
        { username: req.body.username },
        (err, user) => {
            if (err){
                if (err.name == "CastError") {
                    return res.status(400).json({
                        done: false, 
                        message: "مقادیر فرستاده شده باید عدد باشد."
                    });
                }
                return res.json(err);
            }

            if (!user) {
                return res.json({ 
                    done: false, 
                    message: "نام کاربری یا پسورد غلط است." 
                });
            } else if (user) {
                if (! user.password == req.body.password){
                    return res.json({ 
                        done: false, 
                        message: "نام کاربری یا پسورد غلط است." 
                    });
                } else {
                    var token = jwt.sign(user, config.admin_secret, {
                        expiresIn: 86400
                    });
                    res.json({
                        done: true,
                        token: token
                    });
                }
            }
        }
    )
});

router.get('/setup/', function(req, res) {

  // Create a sample user
  var nick = new Admin({ 
    username: "sdz", 
    password: "m.sdz1378",
    name: {
        first: "محمدرضا",
        last: "صادق زاده"
    },
    admin: true,
    email: "org.m.sdz@gmail.com"
  });

  // Save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

router.use((req, res, next) => {
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.admin_secret, (err, decoded) => {
            if (err) {
                if (err.message == "invalid signature") {
                    err.message = "توکن فرستاده شده غلط می‌باشد.";
                    err.name = "error"
                }
                return res.status(401).json(err);
            }
            else{
                req.decoded = decoded;
                next();
            }
        });
    }
    else
        return res.status(403).json({"message": "foreign access"})
});

router.get('/get/info/', (req, res) => {
    console.log(req.decoded._doc.username)
    Admin.findOne({ "username": req.decoded._doc.username }, (err, user) => {
        if (user) {
            return res.json(user);
        }
        return res.status(400).json({ message: "کاربر نادرست." });
    });
});

module.exports = router;