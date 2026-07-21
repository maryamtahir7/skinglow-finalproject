import prisma from '../_db.js';

// --- Admin Tool Implementations ---

export const adminTools = {
  getRevenueMetrics: async ({ startDate, endDate }) => {
    console.log('Admin Tool call: getRevenueMetrics', { startDate, endDate });
    try {
      const dateFilter = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) dateFilter.lte = new Date(endDate);

      const where = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

      const aggregate = await prisma.order.aggregate({
        _sum: { total: true },
        _count: { id: true },
        where
      });

      return {
        totalRevenue: aggregate._sum.total || 0,
        totalOrders: aggregate._count.id || 0
      };
    } catch (e) {
      console.error(e);
      return { error: 'Failed to fetch revenue metrics' };
    }
  },

  getTopProducts: async ({ limit = 5 }) => {
    console.log('Admin Tool call: getTopProducts', { limit });
    try {
      // Aggregate order items to find top selling products
      const topItems = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: limit
      });

      // Fetch product details for the top items
      const productIds = topItems.map(item => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } }
      });

      const result = topItems.map(item => {
        const prod = products.find(p => p.id === item.productId);
        return {
          productName: prod ? prod.name : 'Unknown Product',
          quantitySold: item._sum.quantity
        };
      });

      return { topProducts: result };
    } catch (e) {
      console.error(e);
      return { error: 'Failed to fetch top products' };
    }
  },

  getLowStockInventory: async ({ threshold = 10 }) => {
    console.log('Admin Tool call: getLowStockInventory', { threshold });
    try {
      const lowStockProducts = await prisma.product.findMany({
        where: { stock: { lt: threshold } },
        select: { name: true, stock: true }
      });

      return { lowStockItems: lowStockProducts };
    } catch (e) {
      console.error(e);
      return { error: 'Failed to fetch low stock inventory' };
    }
  }
};

// --- Groq (OpenAI format) Tool Declarations for Admin ---

export const adminToolDeclarations = [
  {
    type: 'function',
    function: {
      name: 'getRevenueMetrics',
      description: 'Calculates the total revenue and total number of orders. You can optionally provide a start and end date to filter the results.',
      parameters: {
        type: 'object',
        properties: {
          startDate: {
            type: 'string',
            description: 'Optional start date in ISO format (e.g. 2023-01-01)'
          },
          endDate: {
            type: 'string',
            description: 'Optional end date in ISO format (e.g. 2023-12-31)'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getTopProducts',
      description: 'Retrieves the top-selling products based on quantity sold across all orders.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'The number of top products to return (default is 5)'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getLowStockInventory',
      description: 'Retrieves a list of products that have a stock level below a certain threshold, indicating they need to be reordered.',
      parameters: {
        type: 'object',
        properties: {
          threshold: {
            type: 'number',
            description: 'The stock threshold. Default is 10.'
          }
        }
      }
    }
  }
];
