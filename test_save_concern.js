
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

async function testWrite() {
    try {
        console.log("Attempting to create a test product with 'Concerns'...");

        // Use a dummy categories ID if needed, or just string.
        // Assuming category is a string in this collection based on previous reads.
        const payload = {
            name: "Test Concern Save " + Date.now(),
            price: 100,
            imageUrl: "https://example.com/test.jpg",
            category: "Test",
            description: "Test description",
            Concerns: "TestConcernValue" // Capitalized as discovered
        };

        const result = await databases.createDocument(
            databaseId,
            tableId,
            "unique()",
            payload
        );

        console.log("✅ Document created successfully!");
        console.log("ID:", result.$id);
        console.log("Concerns Field Value:", result.Concerns);

        // Clean up
        await databases.deleteDocument(databaseId, tableId, result.$id);
        console.log("Cleaned up test document.");

    } catch (e) {
        console.error("❌ Write Failed:", e.message);
        if (e.response) {
            console.error("Response:", JSON.stringify(e.response, null, 2));
        }
    }
}

testWrite();
