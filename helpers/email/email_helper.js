const { SESClient, SendRawEmailCommand } = require("@aws-sdk/client-ses");
require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');

const SES_CONFIG = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
}

const AWS_SES = new SESClient(SES_CONFIG);

async function handleEmailNotification(recipientEmail, header, pdfBuffer,sitename, name) {
    const senderEmail = process.env.AWS_Sender_Email;

    // Create a nodemailer transport
    const transporter = nodemailer.createTransport({
        SES: { ses: AWS_SES, aws: require('@aws-sdk/client-ses') }
    });

    // Read the image file into a buffer
    const imageBuffer = fs.readFileSync('/Users/Thabiso/Downloads/massivePostgressServer/assets/omniscience.png');

    // Create the email options
    const mailOptions = {
        from: senderEmail,
        to: recipientEmail,
        subject: `Production report for  ,${sitename} ${header}`,
        text: "Please find Below attached pdf report",
        html: `<img src="cid:unique@nodemailer.com" style="width:15%;"/>`,
        attachments: [
            {
                filename: name,
                content: pdfBuffer,
                contentType: 'application/pdf'
            },
            {
                filename: 'image.png', // or the appropriate image file name
                content: imageBuffer,
                cid: 'unique@nodemailer.com' // same cid as in the html img src
            }
        ]
    };

    try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email has been sent');
    } catch (error) {
        console.error('Error sending email', error);
        throw error;
    }
}

module.exports = handleEmailNotification;
