const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('upload');
});

router.post('/', (req, res) => {
    if (!req.files.docs)
        return res.status(400).send('No files were uploaded.');
    let sampleFile = req.files.docs;
    sampleFile.mv('filename.jpg', function(err) {
        if (err)
            return res.status(500).send(err);
        res.send('File uploaded!');
    });
});

module.exports = router;