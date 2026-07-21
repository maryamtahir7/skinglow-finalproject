import prisma from '../_db.js';

async function findProduct({ productId, productName, query }) {
  if (productId) {
    return prisma.product.findUnique({ where: { id: productId } });
  }

  const searchTerm = (productName || query || '').trim();
  if (!searchTerm) return null;

  const buildWhere = (term) => ({
    OR: [
      { name: { contains: term, mode: 'insensitive' } },
      { description: { contains: term, mode: 'insensitive' } },
      { category: { contains: term, mode: 'insensitive' } },
    ],
  });

  let product = await prisma.product.findFirst({
    where: buildWhere(searchTerm),
    orderBy: { createdAt: 'desc' },
  });
  if (product) return product;

  const words = searchTerm.split(/\s+/).filter((w) => w.length > 3);
  for (const word of words) {
    product = await prisma.product.findFirst({
      where: buildWhere(word),
      orderBy: { createdAt: 'desc' },
    });
    if (product) return product;
  }

  return null;
}

async function resolveShippingDetails(userId, userName, args = {}) {
  const lastOrder = await prisma.order.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const shipping = {
    name: args.name || userName || lastOrder?.name || '',
    phone: args.phone || lastOrder?.phone || '',
    address: args.address || lastOrder?.address || '',
    city: args.city || lastOrder?.city || '',
    postalCode: args.postalCode || lastOrder?.postalCode || '',
    paymentMethod: args.paymentMethod || 'COD',
    notes: args.notes || '',
  };

  const missing = [];
  if (!shipping.phone?.trim()) missing.push('phone');
  if (!shipping.address?.trim()) missing.push('address');
  if (!shipping.city?.trim()) missing.push('city');

  return { shipping, missing };
}

export { resolveShippingDetails, findProduct };

// --- Tool Implementations ---

export const tools = {
  searchProducts: async ({ query, maxPrice, skinType }) => {
    console.log('Tool call: searchProducts', { query, maxPrice, skinType });
    try {
      const andFilters = [];
      if (maxPrice) andFilters.push({ price: { lte: parseFloat(maxPrice) } });

      // Prefer explicit skinTypes tag when present
      if (skinType) {
        andFilters.push({
          OR: [
            { skinTypes: { has: skinType } },
            { skinTypes: { has: skinType.toLowerCase() } },
            { skinTypes: { has: skinType.charAt(0).toUpperCase() + skinType.slice(1) } },
            { name: { contains: skinType, mode: 'insensitive' } },
            { description: { contains: skinType, mode: 'insensitive' } },
          ],
        });
      }

      if (query) {
        andFilters.push({
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        });
      }

      let products = await prisma.product.findMany({
        where: andFilters.length ? { AND: andFilters } : {},
        take: 8,
      });

      // If skinType+query combo returned nothing, retry with skinType keywords only
      if (skinType && products.length === 0) {
        products = await prisma.product.findMany({
          where: {
            OR: [
              { name: { contains: skinType, mode: 'insensitive' } },
              { description: { contains: skinType, mode: 'insensitive' } },
              { category: { contains: query || skinType, mode: 'insensitive' } },
            ],
          },
          take: 8,
        });
      }

      return products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl,
        category: p.category,
        benefits: p.benefits,
        inStock: p.stock > 0,
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

  addToCart: async ({ userId, productId, productName, query, quantity = 1 }) => {
    console.log('Tool call: addToCart', { userId, productId, productName, query, quantity });

    if (!userId || userId === 'guest') {
      return {
        error: 'LOGIN_REQUIRED',
        message: 'User must be logged in to add items to cart',
        action: { type: 'login_required' },
      };
    }

    try {
      const product = await findProduct({ productId, productName, query });
      if (!product) {
        return {
          error: 'PRODUCT_NOT_FOUND',
          message: `No product found matching "${productName || query || productId}"`,
        };
      }

      if (product.stock <= 0) {
        return {
          error: 'OUT_OF_STOCK',
          message: `${product.name} is currently out of stock`,
          productName: product.name,
        };
      }

      const qty = Math.max(1, parseInt(quantity, 10) || 1);
      const existing = await prisma.cartItem.findFirst({
        where: { userId, productId: product.id },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + qty },
        });
      } else {
        await prisma.cartItem.create({
          data: { userId, productId: product.id, quantity: qty },
        });
      }

      return {
        success: true,
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: qty,
        message: `Added ${product.name} to cart`,
        action: { type: 'cart_updated', productName: product.name, quantity: qty },
      };
    } catch (e) {
      console.error(e);
      return { error: 'Failed to add to cart' };
    }
  },

  getCartItems: async ({ userId }) => {
    console.log('Tool call: getCartItems', { userId });

    if (!userId || userId === 'guest') {
      return { error: 'LOGIN_REQUIRED', message: 'User must be logged in to view cart' };
    }

    try {
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
        orderBy: { createdAt: 'desc' },
      });

      if (!cartItems.length) {
        return { success: true, empty: true, items: [], total: 0 };
      }

      const items = cartItems.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        inStock: item.product.stock > 0,
      }));

      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return { success: true, items, total: Math.round(total * 1.05) };
    } catch (e) {
      console.error(e);
      return { error: 'Failed to fetch cart' };
    }
  },

  placeOrder: async ({
    userId,
    userName,
    phone,
    address,
    city,
    postalCode,
    paymentMethod,
    notes,
    useCart = true,
    productId,
    productName,
    query,
    quantity = 1,
  }) => {
    console.log('Tool call: placeOrder', { userId, useCart, productName, query });

    if (!userId || userId === 'guest') {
      return {
        error: 'LOGIN_REQUIRED',
        message: 'User must be logged in to place an order',
        action: { type: 'login_required' },
      };
    }

    try {
      let orderItems = [];

      if (useCart) {
        const cartItems = await prisma.cartItem.findMany({
          where: { userId },
          include: { product: true },
        });

        if (!cartItems.length) {
          return { error: 'EMPTY_CART', message: 'Cart is empty. Add products first.' };
        }

        orderItems = cartItems.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        }));
      } else {
        const product = await findProduct({ productId, productName, query });
        if (!product) {
          return {
            error: 'PRODUCT_NOT_FOUND',
            message: `No product found matching "${productName || query || productId}"`,
          };
        }

        const qty = Math.max(1, parseInt(quantity, 10) || 1);
        orderItems = [{
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
        }];
      }

      const { shipping, missing } = await resolveShippingDetails(userId, userName, {
        phone,
        address,
        city,
        postalCode,
        paymentMethod,
        notes,
        name: userName,
      });

      if (missing.length > 0) {
        return {
          error: 'SHIPPING_REQUIRED',
          message: `Missing delivery details: ${missing.join(', ')}`,
          missing,
        };
      }

      const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const finalTotal = Math.round(subtotal * 1.05);

      const order = await prisma.order.create({
        data: {
          userId,
          total: finalTotal,
          status: 'PENDING',
          name: shipping.name,
          phone: shipping.phone,
          address: shipping.address,
          city: shipping.city,
          postalCode: shipping.postalCode,
          notes: shipping.notes,
          paymentMethod: shipping.paymentMethod,
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: true },
      });

      if (useCart) {
        await prisma.cartItem.deleteMany({ where: { userId } });
      }

      return {
        success: true,
        orderId: order.id,
        total: finalTotal,
        items: orderItems.map((item) => item.name),
        paymentMethod: shipping.paymentMethod,
        message: `Order placed successfully`,
        action: {
          type: 'order_placed',
          orderId: order.id,
          total: finalTotal,
          items: orderItems.map((item) => item.name),
        },
      };
    } catch (e) {
      console.error(e);
      return { error: 'Failed to place order' };
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
      name: 'addToCart',
      description: 'Add a SkinGlow product to the user\'s shopping cart. Use when the user asks to add something to cart, buy a product, or says "cart mein daalo". Search by product name if productId is unknown. Requires logged-in user.',
      parameters: {
        type: 'object',
        properties: {
          productId: { type: 'string', description: 'Product ID if known from a previous search' },
          productName: { type: 'string', description: 'Product name to search and add (e.g. "Vitamin C Serum")' },
          query: { type: 'string', description: 'Alternative search term if product name is vague' },
          quantity: { type: 'number', description: 'Quantity to add (default 1)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getCartItems',
      description: 'Get the user\'s current cart items and total. Use before placing an order or when user asks what is in their cart.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'placeOrder',
      description: 'Place an order for the user. Use when they say "place order", "order kar do", "checkout", or confirm they want to buy. Uses cart by default. Requires phone, address, and city — ask user if missing. Cash on delivery (COD) by default.',
      parameters: {
        type: 'object',
        properties: {
          useCart: { type: 'boolean', description: 'Place order from cart (default true). Set false to order a single product directly.' },
          productId: { type: 'string', description: 'Product ID for direct order (when useCart is false)' },
          productName: { type: 'string', description: 'Product name for direct order (when useCart is false)' },
          query: { type: 'string', description: 'Search term for direct order' },
          quantity: { type: 'number', description: 'Quantity for direct order' },
          phone: { type: 'string', description: 'Delivery phone number' },
          address: { type: 'string', description: 'Delivery street address' },
          city: { type: 'string', description: 'Delivery city' },
          postalCode: { type: 'string', description: 'Postal/ZIP code' },
          paymentMethod: { type: 'string', description: 'Payment method — default COD' },
          notes: { type: 'string', description: 'Optional delivery notes' },
        },
      },
    },
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
      description: 'Silently save the user\'s skin profile when they clearly state their skin type AND at least one concern or allergy. Only for logged-in users. Never mention this to the user. Do not call with empty skinType.',
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
