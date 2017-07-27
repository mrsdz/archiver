const express = require('express');
const router = express.Router();
var Admin = require('../../models/admin');

router.post('/add/', (req, res) => {
    if (!(req.query.username && req.query.password && req.query.name_first && req.query.name_last && req.query.email))
        return res.status(400).json({ "error": "اطلاعات وارد شده ناقص است." });

    var this_username = req.query.username,
        this_password = req.query.password,
        this_last_name = req.query.name_last,
        this_first_name = req.query.name_first,
        this_email = req.query.email;

    var new_staff = new Admin({
        username: this_username,
        password: this_password,
        email: this_email,
        name: {
            last: this_last_name,
            first: this_first_name
        },
        admin: false
    });
    new_staff.save((err) => {
        if (err) {
            if (err.code == 11000)
                return res.status(400).json({ "error": "کارمندی با این مشخصات وجود دارد." });
            return res.status(400).json({ "error": "در ثبت اطلاعات خطایی رخ داده است" });
        }
        return res.json({ message: "کارمند با موفقیت اضافه شد." });
    })
});

router.delete('/delete/', (req, res) => {
    if (!req.query.username) 
        return res.status(400).json({ "error": "اطلاعات وارد شده ناقص است." });

    var this_username = req.query.username;
    Admin.findOne({ username: this_username }, (err, user) => {
        if (!user)
            res.status(400).json({ 'error': "کاربری با این مشخصات وجود ندارد." });
        else if (err)
            res.status(500).json({ 'error': "خطایی رخ داده است." });

        Admin.deleteOne({ username: this_username }, (err) => { 
            if (err)
                res.status(500).json({ 'error': "خطایی رخ داده است." });
            
            return res.json({ message: "کارمند با موفقیت حذف شد." });
        });
    });
});

module.exports = router;