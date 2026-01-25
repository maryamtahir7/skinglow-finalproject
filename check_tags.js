
import axios from 'axios';

const endpoint = "https://cloud.appwrite.io/v1";
const projectId = "696e6a840014e162467e";
const databaseId = "696e6b70001435b8aec7";
const collectionId = "products";

async function checkTags() {
    try {
        console.log("Fetching products to check tags...");
        const url = `${endpoint}/databases/${databaseId}/collections/${collectionId}/documents`;

        const response = await axios.get(url, {
            headers: {
                'X-Appwrite-Project': projectId,
                'Content-Type': 'application/json'
            }
        });

        const products = response.data.documents;
        console.log(`Fetched ${products.length} products.`);

        products.slice(0, 5).forEach(p => {
            console.log(`Product: "${p.name}"`);
            console.log(`   Tags Field:`, p.tags);
            console.log(`   Description Field:`, p.description ? p.description.substring(0, 20) + "..." : "N/A");
            console.log("---");
        });

    } catch (e) {
        console.error("Error:", e.message);
    }
}

checkTags();
