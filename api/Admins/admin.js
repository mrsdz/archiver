const express = require('express');
const app = express;
const router = express.Router();
var Admin = require('../../models/admin');
const jwt = require('jsonwebtoken');
const MainDocsApi = require('./maindocs');
const Staff = require('./staff');
const StudentAction = require('./student_action');

/*
    this file isn't in github repository and you should add this manually like this:
    module.exports = {
        'secret': "this is top secret",
    };
*/
const config = require('../../config')

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

router.use('/studentAction/', StudentAction);
router.use('/staff/', Staff);
router.use('/maindoc/', MainDocsApi);

module.exports = router;