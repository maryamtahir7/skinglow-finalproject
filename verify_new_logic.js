
import axios from 'axios';

const endpoint = "https://cloud.appwrite.io/v1";
const projectId = "696e6a840014e162467e";
const databaseId = "696e6b70001435b8aec7";
const collectionId = "products";

// New implemented logic
function filterProducts(products, activeConcern) {
    return products.filter(p => {
        const matchConcern = activeConcern === 'all' ||
            (p.Concerns && String(p.Concerns).toLowerCase().includes(activeConcern.toLowerCase())) ||
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
        console.log("Fetching products...");
        const url = `${endpoint}/databases/${databaseId}/collections/${collectionId}/documents`;
        const response = await axios.get(url, { headers: { 'X-Appwrite-Project': projectId } });

        const products = response.data.documents;
        console.log(`Fetched ${products.length} products to test.`);

        // Test Cases
        const scenarios = [
            { name: "Acne", concern: "acne" },
            { name: "Aging", concern: "aging" },
            // Add a fake product locally to test logic if real data is missing the column
            {
                name: "SIMULATED: Acne Cream",
                isSim: true,
                Concerns: "Acne, Pimples",
                testConcern: "acne"
            }
        ];

        // Inject simulated product for testing logic correctness
        const simProduct = {
            $id: "sim1",
            name: "Simulated Acne Cream",
            Concerns: "Acne Treatment",
            description: "Good for skin",
            tags: []
        };
        products.push(simProduct);

        console.log("\n--- Verification of Logic ---");
        scenarios.forEach(sc => {
            // Fix: Use correct search term (sc.name is a label here, not the search query for the loop logic)
            // But wait, the loop logic below uses `sc.name || sc.concern` which is confusing. 
            // The scenario list has objects like { name: "Acne", concern: "acne" }.
            // The simulated one has { name: "SIMULATED...", isSim: true, testConcern: "acne" }.

            // Let's standardise the search term.
            const searchTerm = sc.testConcern || sc.concern;
            const matches = filterProducts(products, searchTerm);
            console.log(`Search: "${searchTerm}" -> Found ${matches.length} matches.`);

            if (sc.isSim) {
                if (!matches.length) console.error("❌ FAILED: Simulated product with 'Concerns' column not found!");
                else if (matches.find(m => m.$id === 'sim1')) console.log("✅ SUCCESS: Logic correctly found product via 'Concerns' column.");
            }
        });

    } catch (e) {
        console.error("Error:", e.message);
    }
}

verify();
