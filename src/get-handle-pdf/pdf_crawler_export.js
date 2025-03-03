const fs = require('fs');
const path = require("path");
const pdfParse = require('pdf-parse');

// Get the correct path to `src/outputs/`

const outputPath = path.join(__dirname, "..", "outputs", "productNumbers.txt");

const pdf_crawler_export = async (url) => {
    try {
        console.log(`Downloading PDF from: ${url}`);

        // Fetch the PDF using fetch
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download PDF. Status code: ${response.status}`);
        }

        // Convert response to a buffer
        const pdfBuffer = Buffer.from(await response.arrayBuffer());

        // Parse the PDF content
        const pdfData = await pdfParse(pdfBuffer);

        // Extract 5-digit product numbers using regex
        const productNumbers = pdfData.text.match(/\b\d{5}\b/g);
        console.log('Extracted Product Numbers:', productNumbers);

        // Save the extracted numbers to a file
        if (productNumbers && productNumbers.length > 0) {
            const formattedNumbers = productNumbers.map(num => `H10${num}H`).join(',');
           
            fs.writeFileSync(outputPath, formattedNumbers, 'utf-8');
            console.log(`Formatted product numbers saved to: ${outputPath}`);
            return formattedNumbers;
        } else {
            console.log('No 5-digit numbers found in the PDF.');
            return [];
        }
    } catch (error) {
        console.error(`Error processing PDF: ${error.message}`);
        throw error;
    }
};

// Export the function
module.exports = { pdf_crawler_export };
