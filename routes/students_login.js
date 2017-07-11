const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    res.end('hi')
});

module.exports = router;