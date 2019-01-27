const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
let session = require('express-session');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
const app = express();

// view engine setup
app.engine('ejs', require('express-ejs-extend'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname + '/public')));
app.use(session({
    secret:'something',
    resave: true,
    saveUninitialized: true
    // cookie:{secure: false}
}));

app.use('/', indexRouter);
app.use('/admin', usersRouter);
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.status(404).send('Sorry cant find that!');
  res.render('error');
});

module.exports = app;
