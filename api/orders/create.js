import prisma from '../../db.js';
import { triggerOrderConfirmation } from '../workflows/n8n.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { userId, items, total, email } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Order must contain items' });
    }

    try {
        // 1. Create order in Prisma Database
        // For guest checkouts, userId might be null, but our Prisma schema requires it if we linked it.
        // Let's assume we create a generic order or link to a real user.
        // To simplify, we will just create the order. Note: Prisma schema requires userId. 
        // In a real app, ensure the guest user is created or order schema allows optional userId.
        
        // This is a simplified creation for demonstration
        const order = await prisma.order.create({
            data: {
                userId: userId || 'guest', // Requires a user record to exist in Prisma!
                total: parseFloat(total) || 0,
                status: 'PENDING',
                items: {
                    create: items.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                items: true
            }
        });

        // 2. Trigger n8n Workflow for Order Confirmation
        // We pass the order details and the customer's email
        triggerOrderConfirmation({
            orderId: order.id,
            email: email,
            total: order.total,
            items: items,
            date: order.createdAt
        }); // Fired asynchronously, no await needed

        res.status(201).json({ message: 'Order created successfully', orderId: order.id });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
}
