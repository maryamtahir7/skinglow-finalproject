import prisma from '../db.js';

// --- Tool Implementations ---

export const tools = {
  searchProducts: async ({ query, maxPrice, skinType }) => {
    console.log('Tool call: searchProducts', { query, maxPrice, skinType });
    try {
      const filters = {};
      if (skinType) filters.skinTypes = { has: skinType };
      if (maxPrice) filters.price = { lte: parseFloat(maxPrice) };
      
      const products = await prisma.product.findMany({
        where: {
          AND: [
            filters,
            {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { category: { contains: query, mode: 'insensitive' } }
              ]
            }
          ]
        },
        take: 5
      });
      return products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        benefits: p.benefits,
        inStock: p.stock > 0
      }));
    } catch (e) {
      console.error(e);
      return { error: 'Failed to fetch products' };
    }
  },

  getOrderStatus: async ({ orderId }) => {
    console.log('Tool call: getOrderStatus', { orderId });
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });
      if (!order) return { error: 'Order not found' };
      return { status: order.status, total: order.total, date: order.createdAt };
    } catch (e) {
      console.error(e);
      return { error: 'Failed to fetch order status' };
    }
  },

  updateSkinProfile: async ({ userId, skinType, concerns, allergies }) => {
    console.log('Tool call: updateSkinProfile', { userId, skinType, concerns, allergies });
    if (!userId) return { error: 'User ID is required to update profile' };
    try {
      const profile = await prisma.customerProfile.upsert({
        where: { userId },
        update: {
          skinType,
          concerns: concerns || [],
          allergies: allergies || []
        },
        create: {
          userId,
          skinType,
          concerns: concerns || [],
          allergies: allergies || []
        }
      });
      return { success: true, profile: { skinType: profile.skinType, concerns: profile.concerns } };
    } catch (e) {
      console.error(e);
      return { error: 'Failed to update skin profile' };
    }
  }
};

// --- Groq (OpenAI format) Tool Declarations ---

export const toolDeclarations = [
  {
    type: 'function',
    function: {
      name: 'searchProducts',
      description: 'Search the SkinGlow product database for skincare products based on a query, maximum price, or skin type. Use this when a user is looking for product recommendations.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query (e.g., "serum", "cleanser", "vitamin c")'
          },
          maxPrice: {
            type: 'number',
            description: 'The maximum price the user is willing to pay'
          },
          skinType: {
            type: 'string',
            description: 'The target skin type (e.g., "oily", "dry", "combination", "sensitive", "normal")'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getOrderStatus',
      description: 'Check the status of a customer\'s order using their order ID.',
      parameters: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            description: 'The unique ID of the order'
          }
        },
        required: ['orderId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'updateSkinProfile',
      description: 'Create or update the user\'s skin profile based on their quiz answers or conversation. Always call this when the user reveals their skin type, concerns, or allergies.',
      parameters: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'The ID of the currently logged-in user. If the user is a guest, do not call this.'
          },
          skinType: {
            type: 'string',
            description: 'The user\'s skin type'
          },
          concerns: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of skin concerns (e.g., acne, aging, dark spots)'
          },
          allergies: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of allergies or ingredients to avoid'
          }
        },
        required: ['userId', 'skinType']
      }
    }
  }
];
