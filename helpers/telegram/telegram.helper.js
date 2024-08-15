// Import the necessary libraries
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');  
const path = require('path');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram bot token
const botToken = process.env.telegramBotToken;

// Create a new instance of TelegramBot
const bot = new TelegramBot(botToken, { polling: true });


// Async function to send a PDF buffer to a specific chat ID with a caption and custom filename
async function sendPdfBuffer(chatId, pdfBuffer, fileName) {
  try {
    const fileOptions = {
      // Explicitly specify the file name.
      filename: fileName,
      // Explicitly specify the MIME type (optional).
      contentType: 'application/pdf',
    };

    // Send the document to Telegram with the specified filename, caption, and content type
    await bot.sendDocument(chatId, pdfBuffer, {}, fileOptions);

    console.log(`Sent PDF: ${fileName}`);
  } catch (error) {
    console.error('Error sending PDF to Telegram:', error.message);
  }
}



// Async function to handle Telegram notifications for a PDF buffer
async function handleTelegramNotification(chatId, pdfBuffer, fileName) {
  try {
    // Send the PDF buffer to Telegram
   await sendPdfBuffer(chatId, pdfBuffer, fileName);
  } catch (error) {
    console.error('Error handling Telegram notification:', error);
  }
}

// Export the function for use in other modules
module.exports = handleTelegramNotification;
