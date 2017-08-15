const express = require('express');
const router = express.Router();
var Account = require('../../models/account');

router.post('/add/', (req, res) => {
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

router.delete('/delete/', (req,res) => {
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

router.post('/update/', (req, res) => {
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

router.get('/get/', (req, res) => {
    if (!req.query.username)
        return res.status(400).json({ "error": "اطلاعات وارد شده ناقص است." });
    var this_username = req.query.username;
    Account.findOne({ username: this_username }, (err, user) => {
        if (!user)
            return res.status(400).json({ "error": "دانشجویی با این شماره دانشجویی وجود ندارد." });
        return res.json(user);
    });
});

router.post('/acceptDoc/', (req, res) => {
    if (!(req.query.username && req.query.doc_id))
        return res.status(400).json({ "error": "اطلاعات وارد شده ناقص است." });
    var this_username = req.query.username,
        this_doc_id = req.body.doc_id;
    Account.findOne({ username: this_username }, (err, user) => {
        if (!user)
            return res.status(400).json({ "error": "دانشجویی با این شماره دانشجویی وجود ندارد." });
        return res.json({ message: parseInt(user.docs.id) })
    });
});

module.exports = router;