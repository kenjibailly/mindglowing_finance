const express = require('express');
const router = express.Router();
const Invoice = require('../../models/invoice');
const User = require('../../models/user');
const Customization = require('../../models/customization');
const authenticateToken = require('../security/authenticate');
const pdf = require('html-pdf');

const fs = require('fs');
// const PDFDocument = require('pdfkit');
const PDFDocument = require('pdfkit-table');
const formatDateTime = require('../formatters/date_time_formatter');

// Get the invoice page by id
router.get('/:id', authenticateToken, async function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // Get the invoice ID
    const invoice_id = req.params.id;

    // If the user is logged in
      if(!user) {
          // Render the login page
          return res.redirect('/login');
      }
      try {
        // Use the find method to get invoice by id
        const invoice = await Invoice.findOne({ _id: invoice_id });

        // Use the find method to get the user settings
        const user_settings = await User.findOne({ username: user.username });

        // Use the find method to get the customization settings
        const customization_settings = await Customization.findOne();
        const invoicePrefix = customization_settings.invoice_prefix + customization_settings.invoice_separator;

        const pdf_path = `/pdf/${invoicePrefix}${invoice.number}_${invoice_id}.pdf`;

        createPDF(invoice, user_settings);

        // Render the items page
        res.render('invoices/pdf_invoice', { 
          user: user_settings, 
          invoice: invoice, 
          pdf_path: pdf_path,
          access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
          user_settings: user_settings, 
          site_title: 'PDF Invoice',
        });
      } catch (error) {
        console.error(error);
        res.render('invoices/invoices', { username: user.username, access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS});
    }
});


async function createPDF(invoice, user_settings) {

  // Ensure the directory exists
  const directoryPath = 'public/pdf/';
  if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
  }

  // // Use the find method to get the customization settings
  const customization_settings = await Customization.findOne();
  const invoicePrefix = customization_settings.invoice_prefix + customization_settings.invoice_separator;

    // Create HTML content
    const htmlContent = `
    <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                h1 { color: #4CAF50; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; }
                th { background-color: #8e38ff; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>Project Time Tracking</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Start</th>
                        <th>Stop</th>
                        <th>Time Passed</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.project_billed.timeTracking.map(timeTracking => `
                    <tr>
                        <td>${timeTracking.name}</td>
                        <td>${formatDateTime(timeTracking.start, user_settings)}</td>
                        <td>${formatDateTime(timeTracking.stop, user_settings)}</td>
                        <td>${timeTracking.timePassed}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </body>
    </html>
    `;

    const options = { format: 'A4' };

    pdf.create(htmlContent, options).toFile(`public/pdf/${invoicePrefix}${invoice.number}_${invoice.id}.pdf`, (err, res) => {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/output.pdf' }
    });

}  

module.exports = router;