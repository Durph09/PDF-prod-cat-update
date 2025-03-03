import { config } from 'dotenv';
config();

import { getBCID } from './bigcommerce_api/getBCID.mjs';

import { postCatChng } from './bigcommerce_api/postCatChng.mjs';


const { pdf_crawler_export } = await import('./get-handle-pdf/pdf_crawler_export.js'); // Adjust the path as needed



async function UpdatePromoProducts(url) {
const pdfProdArr = await pdf_crawler_export(url)// returns an array of product numbers from the pdf and creates productNumbers.txt
  // Call the function
  const postBody = await getBCID(pdfProdArr); // returns an object with the response SKUs and BCIDs
  const postStatus = await postCatChng(postBody); // post new items to sales category by hitting hepsales api which also removes the previous items.
  console.log('postStatus: ', postStatus)
}
const args = process.argv.slice(2)
const url = args[0]

UpdatePromoProducts(url);
