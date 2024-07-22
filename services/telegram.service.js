const PDFTableGenerator = require('../helpers/pdf_templates/template_1_pdf');
const handleTelegramNotification = require('../helpers/telegram/telegram.helper')
const handleEmailNotification = require('../helpers/email/email_helper')


async function populateObjects(reportdata,chatId,sitename,reportHeaderRenames,reportTime) {



    const report_name = `${sitename}_report.pdf`;

    //creating pdf report here
    PDFTableGenerator(reportdata,sitename,report_name,reportHeaderRenames)
        .then(async (pdfBuffer) => {

            // Handle the generated PDF buffer
            console.log('PDF generation successful');
            const caption = `${sitename}_report`;

                // Send the PDF buffer to Telegram with the specified caption
           // handleTelegramNotification('-4019893816', pdfBuffer, `${sitename}_report.pdf`, caption);
            await handleTelegramNotification(chatId, pdfBuffer, `${sitename}_report.pdf`, caption);

          //email helper
          
        // await  handleEmailNotification("blessedngust13@gmail.com",reportTime,pdfBuffer,sitename,`${sitename}_report.pdf`);

        })
        .catch((error) => {
            // Handle errors during PDF generation
            console.error('Error creating PDF:', error);
        });


}


module.exports = {
    populateObjects
}