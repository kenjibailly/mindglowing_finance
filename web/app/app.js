const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger_morgan = require('morgan');
const hbs = require('hbs');
const mongoose = require('mongoose');
const mongodb_URI = require('./routes/mongodb/URI');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const sessionExpirationMiddleware = require('./routes/security/sessionExpirationMiddleware');
const config = require('config');
// Import the handlebars-helpers.js file
require('./handlebars-helpers');
const Logger = require('./logger');
global.logger = new Logger('Finance Web');

//////// ROUTERS //////// 

const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');
const renewTokenRouter = require('./routes/security/renew-token');
const loginRouter = require('./routes/login');
const setupRouter = require('./routes/setup');
const logoutRouter = require('./routes/logout');
const searchRouter = require('./routes/search/search');

const customersRouter = require('./routes/customers/customers');
const customerRouter = require('./routes/customers/customer');
const createCustomerRouter = require('./routes/customers/create_customer');
const editCustomerRouter = require('./routes/customers/edit_customer');
const deleteCustomerRouter = require('./routes/customers/delete_customer');
const deleteSelectedCustomersRouter = require('./routes/customers/delete_selected_customers');

const productsRouter = require('./routes/products/products');
const productRouter = require('./routes/products/product');
const createProductRouter = require('./routes/products/create_product');
const editProductRouter = require('./routes/products/edit_product');
const deleteProductRouter = require('./routes/products/delete_product');
const deleteSelectedProductsRouter = require('./routes/products/delete_selected_products');

const invoicesRouter = require('./routes/invoices/invoices');
const invoiceRouter = require('./routes/invoices/invoice');
const createInvoiceRouter = require('./routes/invoices/create_invoice');
const editInvoiceRouter = require('./routes/invoices/edit_invoice');
const deleteInvoiceRouter = require('./routes/invoices/delete_invoice');
const deleteSelectedInvoicesRouter = require('./routes/invoices/delete_selected_invoices');
const PDFInvoiceRouter = require('./routes/invoices/pdf_invoice');

const settingsRouter = require('./routes/settings/account/account');

const paymentMethodRouter = require('./routes/settings/payment_methods/payment_methods');
const createPaymentMethodRouter = require('./routes/settings/payment_methods/create_payment_method');
const editPaymentMethodRouter = require('./routes/settings/payment_methods/edit_payment_method');
const deletePaymentMethodRouter = require('./routes/settings/payment_methods/delete_payment_method');
const deleteSelectedPaymentMethodsRouter = require('./routes/settings/payment_methods/delete_selected_payment_methods');

const discountsRouter = require('./routes/settings/discounts/discounts');
const createDiscountRouter = require('./routes/settings/discounts/create_discount');
const editDiscountRouter = require('./routes/settings/discounts/edit_discount');
const deleteDiscountRouter = require('./routes/settings/discounts/delete_discount');
const deleteSelectedDiscountsRouter = require('./routes/settings/discounts/delete_selected_discounts');

const shippingCompaniesRouter = require('./routes/settings/shipping_companies/shipping_companies');
const createShippingCompanyRouter = require('./routes/settings/shipping_companies/create_shipping_company');
const editShippingCompanyRouter = require('./routes/settings/shipping_companies/edit_shipping_company');
const deleteShippingCompanyRouter = require('./routes/settings/shipping_companies/delete_shipping_company');
const deleteSelectedShippingCompaniesRouter = require('./routes/settings/shipping_companies/delete_selected_shipping_companies');

const taxesRouter = require('./routes/settings/taxes/taxes');
const createTaxRouter = require('./routes/settings/taxes/create_tax');
const editTaxRouter = require('./routes/settings/taxes/edit_tax');
const deleteTaxRouter = require('./routes/settings/taxes/delete_tax');
const deleteSelectedTaxesRouter = require('./routes/settings/taxes/delete_selected_taxes');

const projectsRouter = require('./routes/projects/projects');
const projectRouter = require('./routes/projects/project');
const createProjectRouter = require('./routes/projects/create_project');
const editProjectRouter = require('./routes/projects/edit_project');
const deleteProjectRouter = require('./routes/projects/delete_project');
const deleteSelectedProjectsRouter = require('./routes/projects/delete_selected_projects');

const timeTrackingRouter = require('./routes/projects/time_tracking/time_tracking');
const startTimeTrackingRouter = require('./routes/projects/time_tracking/start_time_tracking');
const stopTimeTrackingRouter = require('./routes/projects/time_tracking/stop_time_tracking');
const deleteSelectedTimeTrackingsRouter = require('./routes/projects/time_tracking/delete_selected_time_trackings');

const customizationRouter = require('./routes/settings/customization/customization');

//////// END ROUTERS //////// 



const cors = require(`cors`);
const app = express();

// Register the partials folder
hbs.registerPartials(path.join(__dirname, 'views/partials'), (err) => {});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger_morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const whitelist = [ 
  `https://${process.env.HOST}:${process.env.HOST_PORT}`,
  `https://${process.env.HOST}`,
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
  logger.error(error);
});

app.set('trust proxy', 1);
app.use(session({
  proxy: true,
  secret: process.env.SECRET_SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { 
    secure: config.get('secure_session_cookie'),
    // sameSite: 'Strict',
    httpOnly: true,
    // domain: 'mindglowing.art',
    // path: '/'
  } // Adjust options based on your needs
}));

// Logout is handled by sessionExpirationMiddleware
app.use(sessionExpirationMiddleware);


//////// ROUTERS INITILIZATION //////// 

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/auth/', renewTokenRouter);
app.use('/login/', loginRouter);
app.use('/setup/', setupRouter);
app.use('/logout/', logoutRouter);
app.use('/search', searchRouter);

app.use('/customers/', customersRouter);
app.use('/customers/customer/', customerRouter);
app.use('/customers/create/', createCustomerRouter);
app.use('/customers/edit/', editCustomerRouter);
app.use('/customers/delete/', deleteCustomerRouter);
app.use('/customers/delete-selected/', deleteSelectedCustomersRouter);

app.use('/products/', productsRouter);
app.use('/products/product/', productRouter);
app.use('/products/create/', createProductRouter);
app.use('/products/edit/', editProductRouter);
app.use('/products/delete/', deleteProductRouter);
app.use('/products/delete-selected/', deleteSelectedProductsRouter);

app.use('/invoices/', invoicesRouter);
app.use('/invoices/invoice/', invoiceRouter);
app.use('/invoices/create/', createInvoiceRouter);
app.use('/invoices/edit/', editInvoiceRouter);
app.use('/invoices/delete/', deleteInvoiceRouter);
app.use('/invoices/delete-selected', deleteSelectedInvoicesRouter);
app.use('/invoices/invoice/pdf', PDFInvoiceRouter);

app.use('/settings/account', settingsRouter);

app.use('/settings/payment-methods/', paymentMethodRouter);
app.use('/settings/payment-methods/create/', createPaymentMethodRouter);
app.use('/settings/payment-methods/edit/', editPaymentMethodRouter);
app.use('/settings/payment-methods/delete/', deletePaymentMethodRouter);
app.use('/settings/payment-methods/delete-selected/', deleteSelectedPaymentMethodsRouter);

app.use('/settings/discounts/', discountsRouter);
app.use('/settings/discounts/create/', createDiscountRouter);
app.use('/settings/discounts/edit/', editDiscountRouter);
app.use('/settings/discounts/delete/', deleteDiscountRouter);
app.use('/settings/discounts/delete-selected/', deleteSelectedDiscountsRouter);

app.use('/settings/shipping-companies/', shippingCompaniesRouter);
app.use('/settings/shipping-companies/create/', createShippingCompanyRouter);
app.use('/settings/shipping-companies/edit/', editShippingCompanyRouter);
app.use('/settings/shipping-companies/delete/', deleteShippingCompanyRouter);
app.use('/settings/shipping-companies/delete-selected/', deleteSelectedShippingCompaniesRouter);

app.use('/settings/taxes/', taxesRouter);
app.use('/settings/taxes/create/', createTaxRouter);
app.use('/settings/taxes/edit/', editTaxRouter);
app.use('/settings/taxes/delete/', deleteTaxRouter);
app.use('/settings/taxes/delete-selected/', deleteSelectedTaxesRouter);

app.use('/projects/', projectsRouter);
app.use('/projects/project/', projectRouter);
app.use('/projects/create/', createProjectRouter);
app.use('/projects/edit/', editProjectRouter);
app.use('/projects/delete/', deleteProjectRouter);
app.use('/projects/delete-selected/', deleteSelectedProjectsRouter);

app.use('/projects/time-tracking/', timeTrackingRouter);
app.use('/projects/time-tracking/start', startTimeTrackingRouter);
app.use('/projects/time-tracking/stop', stopTimeTrackingRouter);
app.use('/projects/time-tracking/delete-selected', deleteSelectedTimeTrackingsRouter);


app.use('/settings/customization/', customizationRouter);

//////// end ROUTERS INITILIZATION //////// 


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

mongoose.connect(mongodb_URI, {useNewUrlParser:true, useUnifiedTopology:true})
.then(() => {
  logger.success('DB connected!')
})
.catch((err) => {
  logger.log(err);
})

module.exports = app;
