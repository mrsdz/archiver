const express = require('express');
const router = express.Router();
var Account = require('./models/account');
const jwt = require('jsonwebtoken');

router.post('/login/', (req, res) => {
    if (!(req.body.username && req.body.password))
        return res.json({ "error": "اطلاعات وارد شده ناقص است." });
    console.log(req.body.username)
    Account.findOne(
        { username: req.body.username },
        (err, user) => {
            if (err){
                if (err.name == "CastError") {
                    return res.json({
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
                    var token = jwt.sign(user, "ilovemyuniversity", {
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

router.get('/setup', function(req, res) {

  // create a sample user
  var nick = new Account({ 
    username: 1378, 
    password: 7878,
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

module.exports = router;