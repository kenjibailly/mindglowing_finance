const express = require('express');
const router = express.Router();
const Invoice = require('../../models/invoice');
const User = require('../../models/user');
const Customization = require('../../models/customization');
const authenticateToken = require('../security/authenticate');
const pdf = require('html-pdf');

const fs = require('fs');
const formatDateTime = require('../formatters/date_time_formatter');
const formatDate = require('../formatters/date_formatter');

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

        createPDF(invoice, user_settings, user);

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
        logger.error(error);
        res.render('invoices/invoices', { username: user.username, access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS});
    }
});


async function createPDF(invoice, user_settings, user) {

    // Ensure the directory exists
    const directoryPath = 'public/pdf/';
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    try {
        // Use the find method to get the customization settings
        const customization_settings = await Customization.findOne();
        const invoicePrefix = customization_settings.invoice_prefix + customization_settings.invoice_separator;

        // Create HTML content
        const htmlContent = `
        <html>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap" rel="stylesheet">
            <style>
                @font-face {
                    font-family: 'gilroy';
                    src: url('http://${process.env.HOST}/built/fonts/gilroy-extrabold-webfont.woff2') format('woff2'),
                            url('http://${process.env.HOST}/built/fonts/gilroy-extrabold-webfont.woff') format('woff');
                    font-weight: normal;
                    font-style: normal;
                    }
                body { font-family: Gilroy; }
                h1 { color: #1f253f; }
                table { 
                    width: 90%; 
                    border-collapse: collapse;
                    border-radius: 10px;
                    border-style: hidden; /* hide standard table (collapsed) border */
                    box-shadow: 0 0 0 1px #5c2f9b; /* this draws the table border  */ 
                    overflow: hidden; 
                    font-family: 'Poppins', sans-serif;
                    font-size: 10px;
                    color: white;
                    margin: 0 auto;
                }
                thead {
                    background: linear-gradient(0deg,#5a5cf8,#8b49f3);
                    color: white;
                }
                thead tr th {
                    padding: 5px;
                }
                tbody {
                    background-color: #5a5cf8;
                }
                tbody tr td {
                    padding: 5px;
                }
                tbody tr:nth-child(odd) { 
                    background-color: #8b49f3;
                }
                .header {
                    width: 100px;
                    margin-left: auto;
                    margin-right: 30px;
                }
            </style>
            </head>
            <body>
                <div class="invoice-information">
                    <h1 class="invoice-title">Invoice</h1>
                    <p>${invoicePrefix}${invoice.number}<p>
                    <p>Invoice Date: ${formatDate(invoice.created_on, user_settings)}</p>
                </div>
                <div class="company-information">
                    <p>${user_settings.personal_information.company_name}</p>
                    <p>${user_settings.personal_information.company_name}</p>
                    <p>${user_settings.personal_information.company_name}</p>
                    <p>${user_settings.personal_information.company_name}</p>
                    <p>${user_settings.personal_information.company_name}</p>
                </div>
                <h2>Project Time Tracking</h2>
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
            if (err) return logger.log(err);
        });
    } catch (error) {
        logger.error(error);
        res.render('invoices/invoices', { username: user.username, access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS});
    }

}  

module.exports = router;