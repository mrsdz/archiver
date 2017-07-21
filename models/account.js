const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema ({
    username: Number,
    password: Number,
    name:{
        first: String,
        last: String
    },
    dore: String,
    maghta: String,
    reshteh: String,
    docs: [
        {
            address: String, 
            name: String, 
            date: {
                type: Date, 
                default: Date.now
            }
        }
    ]
});

module.exports = mongoose.model('accounts', Account);