const express = require('express');
const app = express;
const router = express.Router();
var Admin = require('../models/admin');
var Account = require('../models/account');
const jwt = require('jsonwebtoken');
/*
    this file isn't in github repository and you should add this manually like this:
    module.exports = {
        'secret': "this is top secret",
    };
*/
const config = require('../config')

router.post('/login/', (req, res) => {
    if (!(req.query.username && req.query.password))
        return res.json({ "error": "اطلاعات وارد شده ناقص است." });
    console.log(req.query.username)
    Admin.findOne(
        { username: req.query.username },
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
                if (! user.password == req.query.password){
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
    var token = req.query.token || req.param.token || req.headers['x-access-token'];
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
    Admin.findOne({ "username": req.decoded._doc.username }, (err, user) => {
        if (user) {
            return res.json(user);
        }
        return res.status(400).json({ message: "کاربر نادرست." });
    });
});

router.post('/add/student/', (req, res) => {
    if (!(req.query.username && req.query.password && req.query.name_last && req.query.name_first && req.query.reshteh && req.query.maghta && req.query.dore)) 
        return res.status(400).json({ "error": "اطلاعات وارد شده ناقص است." });

    var this_username = parseInt(req.query.username),
        this_password = parseInt(req.query.password),
        this_last_name = req.query.name_last,
        this_first_name = req.query.name_first,
        this_reshteh = req.query.reshteh,
        this_maghta = req.query.maghta,
        this_dore = req.query.dore;

    var new_student = new Account({
        username: this_username,
        password: this_password,
        dore:this_dore,
        maghta: this_maghta,
        name:{
            last: this_last_name,
            first: this_first_name
        },
        reshteh: this_reshteh
    });
    new_student.save((err) => {
        if (err){
            if (err.code == 11000)
                return res.status(400).json({ message: "دانشجو تکراری است."});
            return res.status(500).json({ message: "Error in saving "});
        }
        return res.json({ message: "اطالاعات با موفقیت به ثبت رسید." });
    });
});

router.post('/delete/student/', (req,res) => {
    if (!(req.query.username)) 
        return res.status(400).json({ "error": "اطلاعات وارد شده ناقص است." });

    this_username = parseInt(req.query.username);

    Account.findOne({ username: this_username }, (err, user) => {
        if (!user)
            return res.status(400).json({ "error": "دانشجویی با این شماره دانشجویی وجود ندارد." });
        else{
            Account.deleteOne({ username: this_username }, (err) => {
                if (err)
                    return res.status(500).json({ message: "Error in deleting "});
                return res.json({ message: "دانشجو با موفقیت حذف گردید."});
            });
        }
    });
});

router.post('/update/student/', (req, res) => {
    if (!(req.query.username && req.query.password && req.query.name_last && req.query.name_first && req.query.reshteh && req.query.maghta && req.query.dore && req.query.unupdated)) 
        return res.status(400).json({ 
            "error": "اطلاعات وارد شده ناقص است." 
        });

    var this_username = parseInt(req.query.username),
        this_password = parseInt(req.query.password),
        this_last_name = req.query.name_last,
        this_first_name = req.query.name_first,
        this_reshteh = req.query.reshteh,
        this_maghta = req.query.maghta,
        this_dore = req.query.dore,
        unupdated = req.query.unupdated;
        
    Account.findOne({ username: unupdated }, (err, user) => {
        if (!user)
            return res.status(400).json({ "error": "دانشجویی با این شماره دانشجویی وجود ندارد." });
        else{
            Account.updateOne({ username: unupdated }, {
                username: this_username,
                password: this_password,
                maghta: this_maghta,
                dore: this_dore,
                reshteh: this_reshteh,
                name: {
                    last: this_last_name,
                    first: this_first_name
                }
            }, (err) => {
                if (err) 
                    return res.status(400).json({ "error": "در ثبت اطلاعات خطایی رخ داده است" });
                return res.json({ message: "اطلاعات با موفقیت به روز شد." });
            });
        }
    });
});

router.get('/get/student/', (req, res) => {
    if (!req.query.username)
        return res.status(400).json({ "error": "اطلاعات وارد شده ناقص است." });
    this_username = req.query.username;
    Account.findOne({ username: this_username }, (err, user) => {
        if (!user)
            return res.status(400).json({ "error": "دانشجویی با این شماره دانشجویی وجود ندارد." });
        return res.json(user);
    });
});

module.exports = router;