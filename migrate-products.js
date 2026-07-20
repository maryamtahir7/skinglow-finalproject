import { Client, Databases, Query } from 'appwrite';
import { PrismaClient } from '@prisma/client';

const client = new Client();
client
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)

const databases = new Databases(client);
const prisma = new PrismaClient();

async function migrate() {
    try {
        console.log('Fetching products from Appwrite...');
        const response = await databases.listDocuments(
            process.env.VITE_APPWRITE_DATABASE_ID,
            process.env.VITE_APPWRITE_TABLE_ID,
            [Query.limit(1000)]
        );

        console.log(`Found ${response.total} products.`);

        for (const doc of response.documents) {
            console.log(`Migrating: ${doc.name}`);
            
            // Check if it already exists
            const existing = await prisma.product.findFirst({
                where: { name: doc.name }
            });

            if (existing) {
                console.log(`Skipping ${doc.name}, already exists.`);
                continue;
            }

            await prisma.product.create({
                data: {
                    name: doc.name,
                    description: doc.description || '',
                    category: doc.category || 'General',
                    price: Number(doc.price) || 0,
                    stock: Number(doc.stock) || 10,
                    ingredients: doc.ingredients || [],
                    skinTypes: doc.skinTypes || [],
                    benefits: doc.benefits || [],
                }
            });
        }
        
        console.log('Migration complete!');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();
