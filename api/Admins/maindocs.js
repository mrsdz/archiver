const express = require('express');
const router = express.Router();
var Account = require('../../models/account');
const MainDocsModels = require('../../models/main_docs');
const MainDocsApi = require('./maindocs');

router.post('/add/', (req, res) => {
    if (!req.query.name)
        return res.status(400).json({ "error": "اطلاعات وارد شده ناقص است." });

    this_name = req.query.name;
    var new_docs = new MainDocsModels ({
        name: this_name
    });
    new_docs.save((err) => {
        if (err) {
            if (err.code == 11000)
                return res.status(400).json({ "error": "مدرک اصلی‌ای با این مشخصات وجود دارد." });
            return res.status(400).json({ "error": "در ثبت اطلاعات خطایی رخ داده است" });
        }
        return res.json({ message: "مدرک اصلی با موفقیت اضافه شد." });
    });
});

router.delete('/delete/', (req, res) => {
    if (!req.query.id)
        return res.status(400).json({ "error": "اطلاعات وارد شده ناقص است." });

    this_id = ObjectId(req.query.id);
    MainDocsModels.findOne({ _id: this_id }, (err, doc) => {
        if (err)
            return res.status(400).json(err);

        if (!doc)
            return res.status(400).json({ "error": "اطلاعاتی با این آیدی وجود ندارد." });

        MainDocsModels.deleteOne({ _id: this_id }, (err) => {
            if (err)
                return res.status(400).json({ "error": "خطایی رخ داده است" });
            return res.json({ message: "اطلاعات با موفقیت پاک شد."});
        });
    });
});

router.post('/update/', (req, res) => {
    if (!(req.query.id && req.query.name))
        return res.status(400).json({ "error": "اطلاعات وارد شده ناقص است." });

    var this_id = ObjectId(req.query.id);
    var this_name = req.query.name;

    MainDocsModels.findOne({ _id: this_id }, (err, doc) => {
        if (err)
            return res.status(400).json(err);

        if (!doc)
            return res.status(400).json({ "error": "اطلاعاتی با این آیدی وجود ندارد." });

        MainDocsModels.updateOne({ _id: this_id }, { name: this_name }, (err) => {
            if (err)
                return res.status(400).json({ "error": "خطایی رخ داده است" });
            return res.json({ message: "اطلاعات با موفقیت به‌روز شد."});
        });
    });
});

module.exports = router;