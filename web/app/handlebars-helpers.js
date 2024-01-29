// handlebars-helpers.js

// Import the Handlebars module
const hbs = require('hbs');

// Register an equal to helper
hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

// Register a not equal to helper
hbs.registerHelper('neq', function (a, b) {
  return a !== b;
});

// Register a reverse helper
hbs.registerHelper('reverse', function (array) {
  return array.slice().reverse();
});

// Register Handlebars helper for greater than
hbs.registerHelper('gt', function (a, b, options) {
  return a > b;
});

// Register Handlebars helper for less than
hbs.registerHelper('lt', function (a, b) {
  return a < b;
});

// Register Handlebars helper for addition
hbs.registerHelper('add', function (a, b) {
  return a + b;
});

// Register Handlebars helper for subtraction
hbs.registerHelper('subtract', function (a, b) {
  return a - b;
});

// Register Handlebars helper for or
hbs.registerHelper('or', function () {
  for (let i = 0; i < arguments.length - 1; i++) {
    if (arguments[i]) {
      return true;
    }
  }
  return false;
});

// Export the hbs module for use in other files
module.exports = hbs;