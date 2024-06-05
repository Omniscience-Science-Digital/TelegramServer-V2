const PDFTableGenerator = require('../helpers/pdf_templates/template_1_pdf');
const handleTelegramNotification = require('../helpers/telegram/telegram.helper')


async function populateObjects(reportdate,chatId,sitename,reportHeaderRenames) {




    const report_name = `${sitename}_report.pdf`;

    //creating pdf report here
    PDFTableGenerator(reportdate,sitename,report_name,reportHeaderRenames)
        .then((pdfBuffer) => {

            // Handle the generated PDF buffer
            console.log('PDF generation successful');
            const caption = `${sitename}_report`;

                // Send the PDF buffer to Telegram with the specified caption
             handleTelegramNotification('-4019893816', pdfBuffer, `${sitename}_report.pdf`, caption);
            //handleTelegramNotification(chatId, pdfBuffer, `${sitename}_report.pdf`, caption);

        })
        .catch((error) => {
            // Handle errors during PDF generation
            console.error('Error creating PDF:', error);
        });


}


module.exports = {
    populateObjects
}