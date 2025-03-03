// import { config } from "dotenv";
// config();

import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getBCID(prodNumArr) {
  const STORE_HASH = process.env.STORE_HASH;
  const X_AUTH_TOKEN = process.env.X_AUTH_TOKEN;
  
  console.log("store hash: ", STORE_HASH);
  console.log("x auth token: ", X_AUTH_TOKEN);

  const chunckArray = (arr, size) => {
    const arrayFromString = arr.split(",");
    const chunks = [];
    for (let i = 0; i < arrayFromString.length; i += size) {
      chunks.push(arrayFromString.slice(i, i + size));
    }
    return chunks;
  };

  const chunkProdNumArr = chunckArray(prodNumArr, 50);

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Auth-Token": `${X_AUTH_TOKEN}`,
    },
  };
  //console.log("chunkProdNumArr: ", chunkProdNumArr);
  try {
    const chunkArrayResp = async (chunkProdNumArr) => {
      let respChunk = [];
      let BCIDChunk = [];
      for (let i = 0; i < chunkProdNumArr.length; i++) {
        let chunk = chunkProdNumArr[i].join();
        const url = `https://api.bigcommerce.com/stores/${STORE_HASH}/v3/catalog/products?sku:in=${chunk}&include_fields=id,sku&limit=200`;
        console.log("------url: ", url);
        const response = await fetch(url, options);
        const result = await response.json();
        const data = result.data;
        const returnedSkusChunk = data.map((item) => item.sku);
        const arrBCID = data.map((item) => item.id);
        respChunk.push(returnedSkusChunk);
        BCIDChunk.push(arrBCID);
      }
      const returnedSkus = respChunk.flat();
      const returnedBCID = BCIDChunk.flat();
      return { respSkus: returnedSkus, respBCID: returnedBCID };
    };

    const respObj = await chunkArrayResp(chunkProdNumArr);
    const returnedSkus = respObj.respSkus;
    const arrBCID = respObj.respBCID;
    console.log("returnedSkus : ", returnedSkus);
    // Original SKUs from the input
    const originalSkus = prodNumArr.split(",");

    // Find SKUs that did not return a result
    const missingSkus = originalSkus.filter(
      (sku) => !returnedSkus.includes(sku)
    );
    const cleanedMissingSkus = missingSkus.map((sku) =>
      sku.replace(/^H10/, "").replace(/H$/, "")
    );
    console.log("SKUs without IDs:", cleanedMissingSkus);
    
      const outputPath = path.join(__dirname, "..", "outputs", "missingNumbers.txt");

    const formattedSkus = cleanedMissingSkus.join(",");
    fs.writeFileSync(outputPath, formattedSkus, "utf-8");

    const postBody = [{ category_id: 5702, product_ids: arrBCID }];
    console.log("postBody: ", postBody);

    return postBody;
  } catch (error) {
    console.error('error in getBCID: ',error);
  }
}
