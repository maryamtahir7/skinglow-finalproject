import prisma from '../../_db.js';
import { triggerLowStockAlert } from '../workflows/_n8n.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { productId, quantityChange } = req.body; // e.g. -1 for selling one item

    if (!productId || quantityChange === undefined) {
        return res.status(400).json({ message: 'Missing product ID or quantity' });
    }

    try {
        // Update the stock in the database
        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                stock: {
                    increment: quantityChange
                }
            }
        });

        // Check if stock is low (e.g. less than 5)
        if (product.stock < 5) {
            console.log(`[Alert] Stock is low for ${product.name} (${product.stock} left)`);
            // Trigger n8n workflow
            triggerLowStockAlert({
                productId: product.id,
                productName: product.name,
                remainingStock: product.stock
            });
        }

        res.status(200).json({ message: 'Stock updated', product });

    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ message: 'Failed to update stock', error: error.message });
    }
}
