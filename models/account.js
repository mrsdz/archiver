const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passport_local = require('passport-local-mongoose');


const Account = new Schema ({
    username: String,
    password: String,
    first_name: String,
    last_name: String,
});

Account.plugin(passport_local);
module.exports = mongoose.model('accounts', Account);