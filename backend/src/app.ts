import createError from "http-errors";
import express from "express";
import { Express, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import loggerMorgan from "morgan";
import mongoose from "mongoose";
import mongodb_URI from "./routes/mongodb/URI";
import session from "express-session";
import sessionExpirationMiddleware from "./routes/security/sessionExpirationMiddleware";
import config from "config";
import connectMongo from "connect-mongodb-session";

// Routers
// import dashboardRouter from "./routes/dashboard";
import renewTokenRouter from "./routes/security/renew-token";
import checkAuthRouter from "./routes/security/check-auth";
import loginRouter from "./routes/login";
import setupRouter from "./routes/setup";
import logoutRouter from "./routes/logout";
import searchRouter from "./routes/search/search";
import userRouter from "./routes/user";

import customersRouter from "./routes/customers/customers";
import customerRouter from "./routes/customers/customer";
import createCustomerRouter from "./routes/customers/create_customer";
import editCustomerRouter from "./routes/customers/edit_customer";
import deleteSelectedCustomersRouter from "./routes/customers/delete_customers";

import productsRouter from "./routes/products/products";
import productRouter from "./routes/products/product";
import createProductRouter from "./routes/products/create_product";
import editProductRouter from "./routes/products/edit_product";
import deleteSelectedProductsRouter from "./routes/products/delete_products";

// import invoicesRouter from "./routes/invoices/invoices";
// import invoiceRouter from "./routes/invoices/invoice";
// import createInvoiceRouter from "./routes/invoices/create_invoice";
// import editInvoiceRouter from "./routes/invoices/edit_invoice";
// import deleteInvoiceRouter from "./routes/invoices/delete_invoice";
// import deleteSelectedInvoicesRouter from "./routes/invoices/delete_selected_invoices";
// import PDFInvoiceRouter from "./routes/invoices/pdf_invoice";

// import settingsRouter from "./routes/settings/account/account";

// import paymentMethodRouter from "./routes/settings/payment_methods/payment_methods";
// import createPaymentMethodRouter from "./routes/settings/payment_methods/create_payment_method";
// import editPaymentMethodRouter from "./routes/settings/payment_methods/edit_payment_method";
// import deletePaymentMethodRouter from "./routes/settings/payment_methods/delete_payment_method";
// import deleteSelectedPaymentMethodsRouter from "./routes/settings/payment_methods/delete_selected_payment_methods";

// import discountsRouter from "./routes/settings/discounts/discounts";
// import createDiscountRouter from "./routes/settings/discounts/create_discount";
// import editDiscountRouter from "./routes/settings/discounts/edit_discount";
// import deleteDiscountRouter from "./routes/settings/discounts/delete_discount";
// import deleteSelectedDiscountsRouter from "./routes/settings/discounts/delete_selected_discounts";

// import shippingCompaniesRouter from "./routes/settings/shipping_companies/shipping_companies";
// import createShippingCompanyRouter from "./routes/settings/shipping_companies/create_shipping_company";
// import editShippingCompanyRouter from "./routes/settings/shipping_companies/edit_shipping_company";
// import deleteShippingCompanyRouter from "./routes/settings/shipping_companies/delete_shipping_company";
// import deleteSelectedShippingCompaniesRouter from "./routes/settings/shipping_companies/delete_selected_shipping_companies";

// import taxesRouter from "./routes/settings/taxes/taxes";
// import createTaxRouter from "./routes/settings/taxes/create_tax";
// import editTaxRouter from "./routes/settings/taxes/edit_tax";
// import deleteTaxRouter from "./routes/settings/taxes/delete_tax";
// import deleteSelectedTaxesRouter from "./routes/settings/taxes/delete_selected_taxes";

import projectsRouter from "./routes/projects/projects";
import projectRouter from "./routes/projects/project";
import createProjectRouter from "./routes/projects/create_project";
import editProjectRouter from "./routes/projects/edit_project";
import deleteProjectRouter from "./routes/projects/delete_projects";
// import deleteSelectedProjectsRouter from "./routes/projects/delete_selected_projects";

import timeTrackingsRouter from "./routes/projects/time_tracking/time_trackings";

// import timeTrackingRouter from "./routes/projects/time_tracking/time_tracking";
import startTimeTrackingRouter from "./routes/projects/time_tracking/start_time_tracking";
import stopTimeTrackingRouter from "./routes/projects/time_tracking/stop_time_tracking";
import deleteSelectedTimeTrackingsRouter from "./routes/projects/time_tracking/delete_selected_time_trackings";

// import customizationRouter from "./routes/settings/customization/customization";

const cors = require("cors");
const app: Express = express();

// Middleware
app.use(loggerMorgan("dev"));
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
  origin: (origin: string | undefined, callback: Function) => {
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
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: mongodb_URI,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24 * 7, // 1 week
  connectionOptions: {
    serverSelectionTimeoutMS: 10000,
  },
});

store.on("error", (error: Error) => {
  logger.error(error);
});

app.set("trust proxy", 1);
app.use(
  session({
    proxy: true,
    secret: process.env.SECRET_SESSION_KEY as string,
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

// Routers Initialization
// app.use("/api/dashboard", dashboardRouter);
app.use("/api/auth/", renewTokenRouter);
app.use("/api/check-auth/", checkAuthRouter);
app.use("/api/login/", loginRouter);
app.use("/api/setup/", setupRouter);
app.use("/api/logout/", logoutRouter);
app.use("/api/search", searchRouter);
app.use("/api/user", userRouter);

app.use("/api/customers/", customersRouter);
app.use("/api/customers/:id", customerRouter);
app.use("/api/customers/create/", createCustomerRouter);
app.use("/api/customers/edit/", editCustomerRouter);
app.use("/api/customers/delete/", deleteSelectedCustomersRouter);

app.use("/api/products/", productsRouter);
app.use("/api/products/:id", productRouter);
app.use("/api/products/create/", createProductRouter);
app.use("/api/products/edit/", editProductRouter);
app.use("/api/products/delete/", deleteSelectedProductsRouter);

// app.use("/api/invoices/", invoicesRouter);
// app.use("/api/invoices/invoice/", invoiceRouter);
// app.use("/api/invoices/create/", createInvoiceRouter);
// app.use("/api/invoices/edit/", editInvoiceRouter);
// app.use("/api/invoices/delete/", deleteInvoiceRouter);
// app.use("/api/invoices/delete-selected", deleteSelectedInvoicesRouter);
// app.use("/api/invoices/invoice/pdf", PDFInvoiceRouter);

// app.use("/api/settings/account", settingsRouter);

// app.use("/api/settings/payment-methods/", paymentMethodRouter);
// app.use("/api/settings/payment-methods/create/", createPaymentMethodRouter);
// app.use("/api/settings/payment-methods/edit/", editPaymentMethodRouter);
// app.use("/api/settings/payment-methods/delete/", deletePaymentMethodRouter);
// app.use(
//   "/api/settings/payment-methods/delete-selected/",
//   deleteSelectedPaymentMethodsRouter
// );

// app.use("/api/settings/discounts/", discountsRouter);
// app.use("/api/settings/discounts/create/", createDiscountRouter);
// app.use("/api/settings/discounts/edit/", editDiscountRouter);
// app.use("/api/settings/discounts/delete/", deleteDiscountRouter);
// app.use(
//   "/api/settings/discounts/delete-selected/",
//   deleteSelectedDiscountsRouter
// );

// app.use("/api/settings/shipping-companies/", shippingCompaniesRouter);
// app.use(
//   "/api/settings/shipping-companies/create/",
//   createShippingCompanyRouter
// );
// app.use("/api/settings/shipping-companies/edit/", editShippingCompanyRouter);
// app.use(
//   "/api/settings/shipping-companies/delete/",
//   deleteShippingCompanyRouter
// );
// app.use(
//   "/api/settings/shipping-companies/delete-selected/",
//   deleteSelectedShippingCompaniesRouter
// );

// app.use("/api/settings/taxes/", taxesRouter);
// app.use("/api/settings/taxes/create/", createTaxRouter);
// app.use("/api/settings/taxes/edit/", editTaxRouter);
// app.use("/api/settings/taxes/delete/", deleteTaxRouter);
// app.use("/api/settings/taxes/delete-selected/", deleteSelectedTaxesRouter);

app.use("/api/projects/", projectsRouter);
app.use("/api/projects/:id", projectRouter);
app.use("/api/projects/create/", createProjectRouter);
app.use("/api/projects/edit/", editProjectRouter);
app.use("/api/projects/delete/", deleteProjectRouter);
// app.use("/api/projects/delete-selected/", deleteSelectedProjectsRouter);

app.use("/api/projects/:projectId/time-trackings/", timeTrackingsRouter);
// app.use("/api/projects/:projectId/time-tracking/", timeTrackingRouter);
app.use(
  "/api/projects/:projectId/time-trackings/start",
  startTimeTrackingRouter
);
app.use("/api/projects/:projectId/time-trackings/stop", stopTimeTrackingRouter);
app.use(
  "/api/projects/time-trackings/delete",
  deleteSelectedTimeTrackingsRouter
);

// app.use("/api/settings/customization/", customizationRouter);

// Error handling
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: err.message,
  });
});

// Connect to MongoDB
mongoose
  .connect(mongodb_URI, {})
  .then(() => {
    logger.success("MongoDB connected successfully.");
  })
  .catch((error: Error) => {
    logger.error("MongoDB connection error:", error);
  });

export default app;
