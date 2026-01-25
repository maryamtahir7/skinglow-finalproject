
import axios from 'axios';

const endpoint = "https://cloud.appwrite.io/v1";
const projectId = "696e6a840014e162467e";
const databaseId = "696e6b70001435b8aec7";
const collectionId = "products";

async function inspectKeys() {
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
            console.log("KEYS found on first product:", Object.keys(products[0]));
            // Check specifically for concern-like keys on all fetched products, as the first one might be old and empty
            const allKeys = new Set();
            products.forEach(p => Object.keys(p).forEach(k => allKeys.add(k)));
            console.log("ALL Unique KEYS across fetched products:", Array.from(allKeys));
        } else {
            console.log("No products found.");
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}

inspectKeys();
