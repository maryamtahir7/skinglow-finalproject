
import axios from 'axios';

const endpoint = "https://cloud.appwrite.io/v1";
const projectId = "696e6a840014e162467e";
const databaseId = "696e6b70001435b8aec7";
const collectionId = "products";

async function inspectProduct() {
    try {
        const url = `${endpoint}/databases/${databaseId}/collections/${collectionId}/documents`;

        const response = await axios.get(url, {
            headers: {
                'X-Appwrite-Project': projectId,
                'Content-Type': 'application/json'
            }
        });

        const products = response.data.documents;
        if (products.length > 0) {
            console.log("Full Product Object Keys:", Object.keys(products[0]));
            console.log("Full Product Object:", JSON.stringify(products[0], null, 2));
        } else {
            console.log("No products found.");
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}

inspectProduct();
