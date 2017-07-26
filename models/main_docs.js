const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MainDocs = new Schema ({
    name: String,
});

module.exports = mongoose.model('main_docs', MainDocs);