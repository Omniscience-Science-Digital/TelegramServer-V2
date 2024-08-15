const PDFTableGenerator = require('../helpers/pdf_templates/template_1_pdf');
const handleTelegramNotification = require('../helpers/telegram/telegram.helper')
const handleEmailNotification = require('../helpers/email/email_helper')


async function populateObjects(reportdata, chatId, sitename, reportHeaderRenames, reportTime, reportTo, email) {



    const report_name = `${sitename}_report.pdf`;

    //creating pdf report here
    PDFTableGenerator(reportdata, sitename, report_name, reportHeaderRenames)
        .then(async (pdfBuffer) => {

            // Handle the generated PDF buffer
            console.log('PDF generation successful');


            if (reportTo == 'Email') {
                //email helper
                console.log(reportTo)
                 await handleEmailNotification(email, reportTime, pdfBuffer, sitename, `${sitename}_report.pdf`);

            }
            else if (reportTo == 'Telegram') {
                console.log(reportTo)
               // await handleTelegramNotification('-4019893816', pdfBuffer, `${sitename}_report.pdf`);
                 await handleTelegramNotification(chatId, pdfBuffer, `${sitename}_report.pdf`);

            }
            else if (reportTo == 'Telegram & Email') {
                console.log(reportTo)

                // Send the PDF buffer to Telegram with the specified caption
                //await handleTelegramNotification('-4019893816', pdfBuffer, `${sitename}_report.pdf`);
                  await handleTelegramNotification(chatId, pdfBuffer, `${sitename}_report.pdf`);

                //email helper

                 await handleEmailNotification(email, reportTime, pdfBuffer, sitename, `${sitename}_report.pdf`);

               // await handleEmailNotification("thabiso@omniscience.digital", reportTime, pdfBuffer, sitename, `${sitename}_report.pdf`);
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