const express = require('express');
const app = express();
const logger = require('morgan'); //This is the standard logger for expressJS
const uploader = require('express-fileupload'); //File uploader
const db = require('mongoose'); //MongoDB Driver
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

//Connect to the shamsipour DB
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

app.set('port', process.env.PORT | 3000); //Get port from env or if that was empty set a port

app.use(logger('dev')); //Log every http requests
app.use(express.static('public')); //Define statics files

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routings
app.use(require('./app'));

app.listen(app.get('port') , (err) => {
    if (err) throw err;
});