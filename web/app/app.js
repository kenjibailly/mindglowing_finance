const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const mongoose = require('mongoose');
const mongodb_URI = require('./routes/mongodb/URI');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const sessionExpirationMiddleware = require('./routes/security/sessionExpirationMiddleware');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const renewTokenRouter = require('./routes/security/renew-token');
const loginRouter = require('./routes/login');
const setupRouter = require('./routes/setup');
const logoutRouter = require('./routes/logout');
const customersRouter = require('./routes/customers/customers');
const createCustomerRouter = require('./routes/customers/create_customer');
const itemsRouter = require('./routes/items/items');
const createItemRouter = require('./routes/items/create_item');
const cors = require(`cors`)

const app = express();

// Register the partials folder
hbs.registerPartials(path.join(__dirname, 'views/partials'), (err) => {});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const whitelist = [ 
  'http://192.168.0.44:8159',
  'https://finance.mindglowing.art',
];

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
      } else {
          callback(new Error("Not allowed by CORS: " + origin));
      }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions))


const store = new MongoDBStore({
  uri: mongodb_URI, // Use your MongoDB connection string
  collection: 'sessions',
  // Expires in 1 week, the user gets logged out after 1 week
  // if this is changed, the refresh token needs to be changed as well in login.js
  // Logout is handled by sessionExpirationMiddleware
  expires: 1000 * 60 * 60 * 24 * 7,
  connectionOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
  },
});

// Catch errors
store.on('error', function (error) {
  console.error(error);
});

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false } // Adjust options based on your needs
}));

// Logout is handled by sessionExpirationMiddleware
app.use(sessionExpirationMiddleware);

app.use('/', indexRouter);
app.use('/auth', renewTokenRouter);
app.use('/login', loginRouter);
app.use('/setup', setupRouter);
app.use('/logout', logoutRouter);
app.use('/customers', customersRouter);
app.use('/customers/create-customer', createCustomerRouter);
app.use('/items', itemsRouter);
app.use('/items/create-item', createItemRouter);

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

// Increase the limit for the body parser (adjust as needed)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

mongoose.connect(mongodb_URI, {useNewUrlParser:true, useUnifiedTopology:true})
.then(() => {
  console.log('DB connected!')
})
.catch((err) => {
  console.log(err);
})

module.exports = app;
