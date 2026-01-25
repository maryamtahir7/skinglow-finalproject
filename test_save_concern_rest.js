
import axios from 'axios';

const endpoint = "https://cloud.appwrite.io/v1";
const projectId = "696e6a840014e162467e";
const databaseId = "696e6b70001435b8aec7";
const collectionId = "products";

async function testWrite() {
    try {
        console.log("Attempting to create a test product via REST API...");
        const url = `${endpoint}/databases/${databaseId}/collections/${collectionId}/documents`;

        const payload = {
            documentId: "unique()",
            data: {
                name: "Test Concern Save " + Date.now(),
                price: 100,
                imageUrl: "https://example.com/test.jpg",
                category: "Test",
                description: "Test description",
                Concerns: "TestConcernValue"
            }
        };

        const response = await axios.post(url, payload, {
            headers: {
                'X-Appwrite-Project': projectId,
                'Content-Type': 'application/json'
            }
        });

        console.log("✅ Document created successfully!");
        console.log("ID:", response.data.$id);
        console.log("Concerns Field Value:", response.data.Concerns);

        // Clean up
        const delUrl = `${url}/${response.data.$id}`;
        await axios.delete(delUrl, {
            headers: { 'X-Appwrite-Project': projectId }
        });
        console.log("Cleaned up test document.");

    } catch (e) {
        console.error("❌ Write Failed:", e.message);
        if (e.response) {
            console.log("Error Details:", JSON.stringify(e.response.data, null, 2));
        }
    }
}

testWrite();
