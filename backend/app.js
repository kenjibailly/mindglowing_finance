const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger_morgan = require("morgan");
const mongoose = require("mongoose");
const mongodb_URI = require("./routes/mongodb/URI");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const sessionExpirationMiddleware = require("./routes/security/sessionExpirationMiddleware");
const config = require("config");
const Logger = require("./logger");
global.logger = new Logger("Finance Web");

//////// ROUTERS ////////

const indexRouter = require("./routes/index");
const dashboardRouter = require("./routes/dashboard");
const renewTokenRouter = require("./routes/security/renew-token");
const loginRouter = require("./routes/login");
const setupRouter = require("./routes/setup");
const logoutRouter = require("./routes/logout");
const searchRouter = require("./routes/search/search");

const customersRouter = require("./routes/customers/customers");
const customerRouter = require("./routes/customers/customer");
const createCustomerRouter = require("./routes/customers/create_customer");
const editCustomerRouter = require("./routes/customers/edit_customer");
const deleteCustomerRouter = require("./routes/customers/delete_customer");
const deleteSelectedCustomersRouter = require("./routes/customers/delete_selected_customers");

const productsRouter = require("./routes/products/products");
const productRouter = require("./routes/products/product");
const createProductRouter = require("./routes/products/create_product");
const editProductRouter = require("./routes/products/edit_product");
const deleteProductRouter = require("./routes/products/delete_product");
const deleteSelectedProductsRouter = require("./routes/products/delete_selected_products");

const invoicesRouter = require("./routes/invoices/invoices");
const invoiceRouter = require("./routes/invoices/invoice");
const createInvoiceRouter = require("./routes/invoices/create_invoice");
const editInvoiceRouter = require("./routes/invoices/edit_invoice");
const deleteInvoiceRouter = require("./routes/invoices/delete_invoice");
const deleteSelectedInvoicesRouter = require("./routes/invoices/delete_selected_invoices");
const PDFInvoiceRouter = require("./routes/invoices/pdf_invoice");

const settingsRouter = require("./routes/settings/account/account");

const paymentMethodRouter = require("./routes/settings/payment_methods/payment_methods");
const createPaymentMethodRouter = require("./routes/settings/payment_methods/create_payment_method");
const editPaymentMethodRouter = require("./routes/settings/payment_methods/edit_payment_method");
const deletePaymentMethodRouter = require("./routes/settings/payment_methods/delete_payment_method");
const deleteSelectedPaymentMethodsRouter = require("./routes/settings/payment_methods/delete_selected_payment_methods");

const discountsRouter = require("./routes/settings/discounts/discounts");
const createDiscountRouter = require("./routes/settings/discounts/create_discount");
const editDiscountRouter = require("./routes/settings/discounts/edit_discount");
const deleteDiscountRouter = require("./routes/settings/discounts/delete_discount");
const deleteSelectedDiscountsRouter = require("./routes/settings/discounts/delete_selected_discounts");

const shippingCompaniesRouter = require("./routes/settings/shipping_companies/shipping_companies");
const createShippingCompanyRouter = require("./routes/settings/shipping_companies/create_shipping_company");
const editShippingCompanyRouter = require("./routes/settings/shipping_companies/edit_shipping_company");
const deleteShippingCompanyRouter = require("./routes/settings/shipping_companies/delete_shipping_company");
const deleteSelectedShippingCompaniesRouter = require("./routes/settings/shipping_companies/delete_selected_shipping_companies");

const taxesRouter = require("./routes/settings/taxes/taxes");
const createTaxRouter = require("./routes/settings/taxes/create_tax");
const editTaxRouter = require("./routes/settings/taxes/edit_tax");
const deleteTaxRouter = require("./routes/settings/taxes/delete_tax");
const deleteSelectedTaxesRouter = require("./routes/settings/taxes/delete_selected_taxes");

const projectsRouter = require("./routes/projects/projects");
const projectRouter = require("./routes/projects/project");
const createProjectRouter = require("./routes/projects/create_project");
const editProjectRouter = require("./routes/projects/edit_project");
const deleteProjectRouter = require("./routes/projects/delete_project");
const deleteSelectedProjectsRouter = require("./routes/projects/delete_selected_projects");

const timeTrackingRouter = require("./routes/projects/time_tracking/time_tracking");
const startTimeTrackingRouter = require("./routes/projects/time_tracking/start_time_tracking");
const stopTimeTrackingRouter = require("./routes/projects/time_tracking/stop_time_tracking");
const deleteSelectedTimeTrackingsRouter = require("./routes/projects/time_tracking/delete_selected_time_trackings");

const customizationRouter = require("./routes/settings/customization/customization");

//////// END ROUTERS ////////

const cors = require("cors");
const app = express();

// Middleware
app.use(logger_morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS settings
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
app.use(cors(corsOptions));

// Session management
const store = new MongoDBStore({
  uri: mongodb_URI,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24 * 7, // 1 week
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  },
});

store.on("error", (error) => {
  logger.error(error);
});

app.set("trust proxy", 1);
app.use(
  session({
    proxy: true,
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: config.get("secure_session_cookie"),
      httpOnly: true,
    },
  })
);

app.use(sessionExpirationMiddleware);

//////// ROUTERS INITILIZATION ////////

app.use("/api", indexRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/auth/", renewTokenRouter);
app.use("/api/login/", loginRouter);
app.use("/api/setup/", setupRouter);
app.use("/api/logout/", logoutRouter);
app.use("/api/search", searchRouter);

app.use("/api/customers/", customersRouter);
app.use("/api/customers/customer/", customerRouter);
app.use("/api/customers/create/", createCustomerRouter);
app.use("/api/customers/edit/", editCustomerRouter);
app.use("/api/customers/delete/", deleteCustomerRouter);
app.use("/api/customers/delete-selected/", deleteSelectedCustomersRouter);

app.use("/api/products/", productsRouter);
app.use("/api/products/product/", productRouter);
app.use("/api/products/create/", createProductRouter);
app.use("/api/products/edit/", editProductRouter);
app.use("/api/products/delete/", deleteProductRouter);
app.use("/api/products/delete-selected/", deleteSelectedProductsRouter);

app.use("/api/invoices/", invoicesRouter);
app.use("/api/invoices/invoice/", invoiceRouter);
app.use("/api/invoices/create/", createInvoiceRouter);
app.use("/api/invoices/edit/", editInvoiceRouter);
app.use("/api/invoices/delete/", deleteInvoiceRouter);
app.use("/api/invoices/delete-selected", deleteSelectedInvoicesRouter);
app.use("/api/invoices/invoice/pdf", PDFInvoiceRouter);

app.use("/api/settings/account", settingsRouter);

app.use("/api/settings/payment-methods/", paymentMethodRouter);
app.use("/api/settings/payment-methods/create/", createPaymentMethodRouter);
app.use("/api/settings/payment-methods/edit/", editPaymentMethodRouter);
app.use("/api/settings/payment-methods/delete/", deletePaymentMethodRouter);
app.use(
  "/api/settings/payment-methods/delete-selected/",
  deleteSelectedPaymentMethodsRouter
);

app.use("/api/settings/discounts/", discountsRouter);
app.use("/api/settings/discounts/create/", createDiscountRouter);
app.use("/api/settings/discounts/edit/", editDiscountRouter);
app.use("/api/settings/discounts/delete/", deleteDiscountRouter);
app.use(
  "/api/settings/discounts/delete-selected/",
  deleteSelectedDiscountsRouter
);

app.use("/api/settings/shipping-companies/", shippingCompaniesRouter);
app.use(
  "/api/settings/shipping-companies/create/",
  createShippingCompanyRouter
);
app.use("/api/settings/shipping-companies/edit/", editShippingCompanyRouter);
app.use(
  "/api/settings/shipping-companies/delete/",
  deleteShippingCompanyRouter
);
app.use(
  "/api/settings/shipping-companies/delete-selected/",
  deleteSelectedShippingCompaniesRouter
);

app.use("/api/settings/taxes/", taxesRouter);
app.use("/api/settings/taxes/create/", createTaxRouter);
app.use("/api/settings/taxes/edit/", editTaxRouter);
app.use("/api/settings/taxes/delete/", deleteTaxRouter);
app.use("/api/settings/taxes/delete-selected/", deleteSelectedTaxesRouter);

app.use("/api/projects/", projectsRouter);
app.use("/api/projects/project/", projectRouter);
app.use("/api/projects/create/", createProjectRouter);
app.use("/api/projects/edit/", editProjectRouter);
app.use("/api/projects/delete/", deleteProjectRouter);
app.use("/api/projects/delete-selected/", deleteSelectedProjectsRouter);

app.use("/api/projects/time-tracking/", timeTrackingRouter);
app.use("/api/projects/time-tracking/start", startTimeTrackingRouter);
app.use("/api/projects/time-tracking/stop", stopTimeTrackingRouter);
app.use(
  "/api/projects/time-tracking/delete-selected",
  deleteSelectedTimeTrackingsRouter
);

app.use("/api/settings/customization/", customizationRouter);

//////// end ROUTERS INITILIZATION ////////

// Add the remaining routers (e.g., expenses, etc.)
// All of these will be used for your API requests in the frontend

// Error handling
app.use((req, res, next) => {
  next(createError(404));
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

// Database connection
mongoose
  .connect(mongodb_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.success("DB connected!");
  })
  .catch((err) => {
    logger.log(err);
  });

module.exports = app;
