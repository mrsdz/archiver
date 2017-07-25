const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Admin = new Schema ({
    username: { type: String, unique: true },
    password: String,
    admin: { 
        type: Boolean, 
        default: false
    },
    name: {
        first: String,
        last: String
    },
    email: String
});

module.exports = mongoose.model('admin', Admin);