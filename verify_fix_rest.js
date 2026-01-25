
import axios from 'axios';

const endpoint = "https://cloud.appwrite.io/v1";
const projectId = "696e6a840014e162467e";
const databaseId = "696e6b70001435b8aec7";
const collectionId = "products";

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

function oldFilterProducts(products, activeConcern) {
    return products.filter(p => {
        const matchConcern = activeConcern === 'all' ||
            (p.description && p.description.toLowerCase().includes(activeConcern.toLowerCase())) ||
            (p.name && p.name.toLowerCase().includes(activeConcern.toLowerCase())) ||
            (p.tags && p.tags.includes(activeConcern));
        return matchConcern;
    });
}

async function verify() {
    try {
        console.log("Fetching products via REST API...");
        const url = `${endpoint}/databases/${databaseId}/collections/${collectionId}/documents`;

        const response = await axios.get(url, {
            headers: {
                'X-Appwrite-Project': projectId,
                'Content-Type': 'application/json'
            }
        });

        const products = response.data.documents;
        console.log(`Fetched ${products.length} products.`);

        const allTags = new Set();
        products.forEach(p => {
            if (Array.isArray(p.tags)) p.tags.forEach(t => allTags.add(t));
            else if (typeof p.tags === 'string') allTags.add(p.tags);
        });
        console.log("All Tags Found:", Array.from(allTags));

        const concerns = ['acne', 'aging', 'dryness', 'dullness', 'sensitivity'];

        console.log("\n--- Verification Comparison ---");
        concerns.forEach(concern => {
            const oldMatches = oldFilterProducts(products, concern);
            const newMatches = filterProducts(products, concern);

            console.log(`Concern: "${concern.toUpperCase()}"`);
            console.log(`  Old Logic Matches: ${oldMatches.length}`);
            console.log(`  New Logic Matches: ${newMatches.length}`);

            if (newMatches.length > oldMatches.length) {
                console.log(`  ✅ IMPROVEMENT: Found ${newMatches.length - oldMatches.length} more products!`);
                const newItems = newMatches.filter(n => !oldMatches.find(o => o.$id === n.$id));
                newItems.forEach(p => console.log(`     - Rescued: "${p.name}" (Tags: ${JSON.stringify(p.tags)})`));
            } else if (newMatches.length === 0) {
                console.log(`  ⚠️ Still 0 matches (might need data update or broader search)`);
            } else {
                console.log(`  No change in count.`);
            }
            console.log("---");
        });

    } catch (e) {
        console.error("Verification failed:", e.message);
        if (e.response) console.error("Response:", e.response.data);
    }
}

verify();
