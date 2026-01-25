
import { Client, Databases } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

const client = new Client();
// Use the same env vars as the app
const endpoint = process.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID;
const tableId = process.env.VITE_APPWRITE_TABLE_ID;

if (endpoint && projectId) {
    client.setEndpoint(endpoint).setProject(projectId);
} else {
    console.error("Environment variables missing");
    process.exit(1);
}

const databases = new Databases(client);

// The logic we implemented in products.jsx
function filterProducts(products, activeConcern) {
    return products.filter(p => {
        const matchConcern = activeConcern === 'all' ||
            (p.description && p.description.toLowerCase().includes(activeConcern.toLowerCase())) ||
            (p.name && p.name.toLowerCase().includes(activeConcern.toLowerCase())) ||
            (p.tags && (
                Array.isArray(p.tags)
                    ? p.tags.some(tag => tag.toLowerCase().includes(activeConcern.toLowerCase()))
                    : String(p.tags).toLowerCase().includes(activeConcern.toLowerCase())
            ));
        return matchConcern;
    });
}

async function verify() {
    try {
        console.log("Fetching products to verify fix...");
        // Fetch all products (simulating getProducts)
        const response = await databases.listDocuments(databaseId, tableId, []);
        const products = response.documents;
        console.log(`Fetched ${products.length} products.`);

        const concerns = ['acne', 'aging', 'dryness', 'dullness', 'sensitivity'];

        console.log("\n--- Verification Results ---");
        concerns.forEach(concern => {
            const matches = filterProducts(products, concern);
            console.log(`Concern: "${concern}" -> Found ${matches.length} products.`);
            if (matches.length > 0) {
                console.log(`   Sample: ${matches[0].name} (Tags: ${matches[0].tags})`);
            } else {
                console.log(`   WARNING: No matches found for "${concern}"`);
            }
        });

    } catch (e) {
        console.error("Verification failed:", e);
    }
}

verify();
