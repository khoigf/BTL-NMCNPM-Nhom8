var createError = require('http-errors');
var express = require('express');
var path = require('path');

var middleware = require('./middleware/middleware')
var configViewEngine = require('./config/viewEngine');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectRouter = require('./routes/project');


var app = express();

// view engine setup
configViewEngine(app);

middleware(app);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/project',projectRouter);

// catch 404 and forward to error handler
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
  res.render('error');
});

module.exports = app;
