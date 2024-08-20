const PDFTableGenerator = require('../helpers/pdf_templates/template_1_pdf');
const handleTelegramNotification = require('../helpers/telegram/telegram.helper')
const handleEmailNotification = require('../helpers/email/email_helper')



async function populateObjects(reportdata, chatId, sitename, reportHeaderRenames, reportTime, reportTo, email, reportnameDate, flag) {



    const report_name = `${sitename}, ${reportnameDate}.pdf`;

    //creating pdf report here
    PDFTableGenerator(reportdata, sitename, report_name, reportHeaderRenames)
        .then(async (pdfBuffer) => {

            // Handle the generated PDF buffer
            console.log('PDF generation successful');

            switch (reportTo) {
                case 'Email':
                    // Email helper
                    await handleEmailNotification(email, reportTime, pdfBuffer, sitename, report_name);
                    break;
            
                case 'Telegram':
                    // Send to Telegram based on the flag
                    flag === "test" 
                        ? await handleTelegramNotification('-4019893816', pdfBuffer, report_name) 
                        : await handleTelegramNotification(chatId, pdfBuffer, report_name);
                    break;
            
                case 'Telegram & Email':
                    // Send to both Telegram and Email based on the flag
                    flag === "test"
                        ? (await handleTelegramNotification('-4019893816', pdfBuffer, report_name),
                           await handleEmailNotification("report-testing@omniscience.digital", reportTime, pdfBuffer, sitename, report_name))
                        : (await handleEmailNotification(email, reportTime, pdfBuffer, sitename, report_name),
                           await handleTelegramNotification(chatId, pdfBuffer, report_name));
                    break;
            
                default:
                    // Handle cases where reportTo doesn't match any expected values
                    console.error("Invalid reportTo value:", reportTo);
                    break;
            }
            

        })
        .catch((error) => {
            // Handle errors during PDF generation
            console.error('Error creating PDF:', error);
        });


}


module.exports = {
    populateObjects
}