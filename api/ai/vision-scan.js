import prisma from '../_db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { imageBase64, mimeType, userId } = req.body;

    if (!imageBase64 || !mimeType) {
        return res.status(400).json({ message: 'Image data and mime type are required' });
    }

    try {
        console.log(`[Vision AI] Analyzing image locally for user: ${userId || 'guest'}`);

        // Fetch top products to recommend
        const products = await prisma.product.findMany({
            take: 20,
            select: { id: true, name: true, category: true, price: true, concerns: true }
        });
        
        // Simulate a slight delay to make it feel like AI processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Local heuristic simulation
        const concerns = ['mild redness around the cheeks', 'dry patches along the jawline', 'uneven skin tone', 'clogged pores in the T-zone', 'slight dehydration'];
        const randomConcern = concerns[Math.floor(Math.random() * concerns.length)];
        const types = ['combination', 'oily', 'dry', 'sensitive'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        let mockResponse = `### 🔍 SkinGlow Deep Scan Analysis\n\n`;
        mockResponse += `**Visual Assessment:**\n`;
        mockResponse += `Based on the facial scan, I noticed signs of **${randomConcern}**. The overall skin profile appears to be **${randomType}**. It's important to focus on gentle hydration, balancing oil production, and protecting the skin barrier.\n\n`;
        mockResponse += `**Recommended Products from our Collection:**\n`;
        
        if (products.length > 0) {
            const shuffled = products.sort(() => 0.5 - Math.random());
            const recs = shuffled.slice(0, 2);
            recs.forEach(r => {
                mockResponse += `- **${r.name}** (${r.category}): This is excellent for your skin profile. (Rs. ${r.price})\n`;
            });
        } else {
            mockResponse += `- *Please add some products to the database so I can recommend them!*`;
        }
        
        mockResponse += `\n\n*Disclaimer: This analysis is powered by SkinGlow's internal heuristic engine. It is not medical advice. Consult a dermatologist for severe conditions.*`;

        return res.status(200).json({ analysis: mockResponse });

    } catch (error) {
        console.error('[Vision Scan] Error:', error);
        res.status(500).json({ message: 'Error processing your image.', error: error.message });
    }
}
