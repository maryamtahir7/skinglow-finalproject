
import { Client, Databases } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

const client = new Client();

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

async function checkProducts() {
    try {
        console.log("Fetching products...");
        const response = await databases.listDocuments(databaseId, tableId);
        console.log(`Found ${response.total} products.`);

        response.documents.forEach(p => {
            console.log(`Product: ${p.name}`);
            console.log(`  Tags (${typeof p.tags}):`, p.tags);
            console.log(`  Category:`, p.category);
            console.log("---");
        });
    } catch (e) {
        console.error("Error:", e);
    }
}

checkProducts();
