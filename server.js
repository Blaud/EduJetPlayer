let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');



let passport = require('passport');
let app = express();
app.set('views', path.join(__dirname, 'assets/template'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

require('./models/Posts');
//require('./models/Words');
require('./models/Users');
require('./config/passport');

let routes = require('./routes/index');
let users = require('./routes/users');
app.use('/', routes);
app.use('/users', users);

app.use(function(req, res, next) {
    let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

let port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
let ip = process.env.OPENSHIFT_NODEJS_IP || '';
let connectionString =  process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://127.0.0.1/mydb";

mongoose.connect(connectionString);
app.listen(port, ip, function() {
    console.log('%s: Node server started on %s:%d ...',
        Date(Date.now() ), ip, port);
});

module.exports = app;
