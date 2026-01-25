
import axios from 'axios';

const endpoint = "https://cloud.appwrite.io/v1";
const projectId = "696e6a840014e162467e";
const databaseId = "696e6b70001435b8aec7";
const collectionId = "products";

async function listAllKeys() {
    try {
        const url = `${endpoint}/databases/${databaseId}/collections/${collectionId}/documents`;
        const response = await axios.get(url, { headers: { 'X-Appwrite-Project': projectId } });

        const allKeys = new Set();
        response.data.documents.forEach(doc => {
            Object.keys(doc).forEach(key => allKeys.add(key));
        });

        console.log("ALL KEYS FOUND:", Array.from(allKeys).sort());
    } catch (e) {
        console.error("Error:", e.message);
    }
}

listAllKeys();
