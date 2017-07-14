const express = require('express'),
    app = express(),
    logger = require('morgan'), //This is the standard logger for expressJS
    uploader = require('express-fileupload'), //File uploader
    db = require('mongoose'), //MongoDB Driver
    passport = require('passport'),
    Strategy = require('passport-local').Strategy,
    flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

db.connect('mongodb://localhost/shamsipour', { useMongoClient: true }, (err) => {
    if (err) throw err;
    else console.log('Connected to db.');
}); //Connect to the shamsipour DB

app.set('port', process.env.PORT | 3000); //Get port from env or if that was empty set a port
app.set('view engine', 'pug'); //Set template engine to ejs
app.set('views', './views'); //Define html files root

app.use(logger('dev')); //Log every http requests
app.use(express.static('public')); //Define statics files

app.use(passport.initialize());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.session());

//Routings
var index = require('./routes/form_load');
app.use('/', index);

var stu_login = require('./routes/students_login');
app.use('/students/login/', stu_login);

var Account = require('./models/account');
passport.use(new Strategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
 

var upload = require('./routes/upload');
app.use('/upload/', uploader(), upload);

app.listen(app.get('port') , (err) => {
    if (err) throw err;
});