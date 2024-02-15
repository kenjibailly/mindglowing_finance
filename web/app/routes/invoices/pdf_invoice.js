const express = require('express');
const router = express.Router();
const Invoice = require('../../models/invoice');
const User = require('../../models/user');
const authenticateToken = require('../security/authenticate');

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
    const pdf_path = `/pdf/${invoice_id}.pdf`;

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


function createPDF(invoice, user_settings) {

  // Ensure the directory exists
  const directoryPath = 'public/pdf/';
  if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
  }

  // Create a new PDF document
  let doc = new PDFDocument({ margin: 30, size: 'A4' });

  // Pipe the PDF to a file
  const filePath = `public/pdf/${invoice.id}.pdf`;
  doc.pipe(fs.createWriteStream(filePath));

  // Table data
  const table = {
      title: 'Project Time Tracking',
      headers: [
        { label: 'Name', property: 'name', headerColor: "#8e38ff" },
        { label: 'Start', property: 'start', headerColor: "#8e38ff" },
        { label: 'Stop', property: 'stop', headerColor: "#8e38ff" },
        { label: 'Time Passed', property: 'timepassed', headerColor: "#8e38ff" },
      ],
      datas: [], // Complex data goes here
      rows: invoice.project_billed.timeTracking.map(timeTracking => [
          timeTracking.name,
          formatDateTime(timeTracking.start, user_settings),
          formatDateTime(timeTracking.stop, user_settings),
          timeTracking.timePassed,
      ]),
  };

  // Create the table
  doc.table(table, { 
    width: 600 ,
    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
      doc.font("Helvetica").fontSize(8);
      indexColumn === 0 && doc.addBackground(rectRow, 'blue', 0.15);
    },
  });

  // Finalize the PDF
  doc.end();

}  

module.exports = router;