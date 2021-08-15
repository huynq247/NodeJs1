var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');

var expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');
const validator = require('express-validator');

//Define Path
global.__base          = __dirname + '/';
global.__path_app      = __base + 'app/';
global.__path_configs  = __path_app + 'configs/';
global.__path_helpers  = __path_app + 'helpers/';
global.__path_routes  = __path_app + 'routes/';
global.__path_schemas  = __path_app + 'schemas/';
global.__path_validates = __path_app + 'validates/';
global.__path_views = __path_app + 'views/';

const systemConfig = require(__path_configs  + 'system');


const flash = require('express-flash-notification');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// tao app 
var app = express();

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash(app, {
  viewName: __path_views + 'elements/flash',
}));

app.use(validator({
  customValidators: {
    isNotEqual: (value1, value2) =>{
      return value1 !== value2;
    }
  }
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts);
app.set('layout', __path_views + 'backend');


//Local variable
app.locals.systemConfig = systemConfig;

//Setup router
app.use(`/${systemConfig.prefixAdmin}`,require( __path_routes + 'backend/index'));
app.use('/',require( __path_routes + 'frontend/index'));

//Setup router method 1
// app.use('/',require('./routes/home'))
// app.use('/dashboard',require('./routes/dashboard'))
// app.use('/items',require('./routes/items'))






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
  res.render(__path_views + 'pages/error',{ pageTitle: 'ErrorPage' });
});

module.exports = app;



// Connect to Mongo DB
const databaseConfig = require( __path_configs + 'database');
mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster0.hfppr.mongodb.net/training_nodejs?retryWrites=true&w=majority`,{useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', ()=>{
    console.log('OH no Error')
});
db.once('open', ()=> {
    console.log('Connected');
});




// //Find items in DBS




