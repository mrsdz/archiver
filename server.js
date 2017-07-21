const express = require('express');
const app = express();
// This is the standard logger for expressJS
const logger = require('morgan');
//File uploader
const uploader = require('express-fileupload'); 
// MongoDB Driver
const db = require('mongoose'); 
const bodyParser = require('body-parser');
// This module is for creating and managing tokens
const jwt = require('jsonwebtoken');
// Connect to the shamsipour DB
db.connect('mongodb://localhost/shamsipour', { useMongoClient: true }, (err) => {
    if (err) throw err;
    else console.log('Connected to db.');
});

// Local variables
app.locals.maghta = [
    { id: 1, name: "کاردانی" },
    { id: 2, name: "کارشناسی" }
];
app.locals.reshteh = [
    { id: 1, name: "IT" },
    { id: 2, name: "کامپیوتر" },
    { id: 3, name: "ICT" },
    { id: 4, name: "الکترونیک" },
    { id: 5, name: "حسابداری بازرگانی" },
    { id: 6, name: "حسابداری صنعتی" },
    { id: 7, name: "حسابداری کارشناسی" },
];

// Get port from env or if that was empty set a port
app.set('port', process.env.PORT | 3000); 

// Log every http requests
app.use(logger('dev')); 

// Define statics files
app.use(express.static('public')); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routings
app.use("/student/", require('./api/student'));
app.use("/admin/", require('./api/admin'));

app.listen(app.get('port') , (err) => {
    if (err) throw err;
});