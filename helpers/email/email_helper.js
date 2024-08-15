require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path'); // To handle file paths

const Email_CONFIG = {
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    GMAIL_USER: process.env.GMAIL_USER,
};

async function handleEmailNotification(recipientEmail, header, pdfBuffer, sitename, name) {
    // Create a transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: Email_CONFIG.GMAIL_USER,
            pass: Email_CONFIG.GMAIL_PASSWORD,
        },
    });

    // Define the path to the header image
    const headerImagePath = path.join(__dirname, '../../assets/grok.png'); // Adjust this path based on your assets location

    // Set up email data
    let mailOptions = {
        from: Email_CONFIG.GMAIL_USER,
        to: recipientEmail,
        subject: `${sitename}  ${header},`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.4; color: #333;">
            <div style="padding: 17px;">
              <p>Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!</p>
              <p>Please find the attached report for your reference.</p>
              <p>Best regards,</p>
            </div>
            <div >
              <img src="cid:header-image" alt="Massive Pty Ltd" style="width:40%; height: 60%">
            </div>
          </div>
        `, // HTML body
        attachments: [
          {
            filename: `${sitename}.pdf`,
            content: pdfBuffer,
          },
          {
            filename: 'header-image.jpg',
            path: headerImagePath, // Path to the header image
            cid: 'header-image', // Same CID value as in the html img src
          }
        ],
      };
      
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}

module.exports = handleEmailNotification;


