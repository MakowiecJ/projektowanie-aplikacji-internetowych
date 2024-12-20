if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const path = require('path');
const cookieParser = require('cookie-parser');
const loginChecker = require('./middleware/checkLogin')
const logger = require('morgan');
const bodyParser = require('body-parser')

const messagesRouter = require('./routes/messages');
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth')
const messageRoutes = require('./routes/messages');
const methodOverride = require('method-override')

const app = express();

const favicon = require('serve-favicon');

app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
app.use(methodOverride('_method'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(loginChecker.addUserToLocals)
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


app.use('/auth', authRouter);
app.use('/posts', postsRouter);
app.use('/messages', messagesRouter);
app.use('/', postsRouter);


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
