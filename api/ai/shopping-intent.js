async function loadTools() {
  const mod = await import('./tools.js');
  return mod.tools;
}

const ADD_TO_CART_PATTERNS = [
  /add\s+.+\s+to\s+(?:my\s+)?cart/i,
  /cart\s*mein\s+.+/i,
  /.+\s+cart\s*mein\s*(?:daal\w*|add|karo)?/i,
  /put\s+.+\s+in\s+(?:my\s+)?cart/i,
  /buy\s+.+\s+(?:for me|now)/i,
  /(?:mujhe|mere liye)\s+.+\s+(?:chahiye|de do|dedo)/i,
];

const PLACE_ORDER_PATTERNS = [
  /place\s+(?:my\s+)?order/i,
  /order\s+(?:place|kar\w*|lag\w*)/i,
  /checkout/i,
  /cart\s+(?:se\s+)?order/i,
  /(?:mera|my)\s+order\s+kar/i,
];

const YES_PATTERNS = /^(yes|yep|yeah|yup|haan|han|ji|ok|okay|confirm|done|theek|thik|bilkul|sure|add it|kar do|kr do|place it)$/i;
const NO_PATTERNS = /^(no|nope|cancel|nahi|nah|stop|mat|don't|dont)$/i;

export function extractProductQuery(message) {
  const patterns = [
    /(?:add|put|daal\w*|dal\w*)\s+(.+?)\s+(?:to|in(?:to)?)\s+(?:my\s+)?cart/i,
    /(.+?)\s+cart\s*mein/i,
    /cart\s*mein\s+(.+)/i,
    /(?:buy|order)\s+(.+?)(?:\s+please|\s+for me|\s+now|$)/i,
    /(?:mujhe|mere liye)\s+(.+?)\s+(?:chahiye|de do|dedo)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (!match?.[1]) continue;

    const query = match[1]
      .replace(/\b(please|plz|karo|kar do|daalo|add|buy|order|mujhe|mere liye)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (query.length > 2 && !/^(ye|yeh|this|it|wo|wahi|the product)$/i.test(query)) {
      return query;
    }
  }

  return null;
}

export function detectShoppingIntent(message) {
  const text = String(message || '').trim();

  if (PLACE_ORDER_PATTERNS.some((p) => p.test(text))) {
    return 'place_order';
  }

  if (ADD_TO_CART_PATTERNS.some((p) => p.test(text))) {
    return 'add_to_cart';
  }

  return null;
}

export function isConfirmationYes(message) {
  return YES_PATTERNS.test(String(message || '').trim());
}

export function isConfirmationNo(message) {
  return NO_PATTERNS.test(String(message || '').trim());
}

export async function previewShoppingAction(message, context = {}) {
  const { userId, userName, userPrefs } = context;
  const intent = detectShoppingIntent(message);
  const tools = await loadTools();

  if (!intent) return null;

  if (!userId || userId === 'guest') {
    return {
      summary: 'Customer is not logged in. Ask them to log in before shopping.',
      actions: [{ type: 'login_required' }],
      handled: true,
    };
  }

  if (intent === 'add_to_cart') {
    const query = extractProductQuery(message);

    if (!query) {
      return {
        summary: 'Customer wants to add to cart but did not name a product. Ask which product they want.',
        handled: false,
      };
    }

    const searchResults = await tools.searchProducts({ query });
    if (!Array.isArray(searchResults) || !searchResults.length) {
      return {
        summary: `No product found for "${query}". Ask the customer to specify the exact product name.`,
        handled: true,
      };
    }

    const product = searchResults[0];
    return {
      summary: `Found "${product.name}". Show the product card and ask the customer to confirm before adding to cart.`,
      pendingConfirmation: {
        type: 'add_to_cart',
        product,
      },
      handled: true,
    };
  }

  if (intent === 'place_order') {
    const cartResult = await tools.getCartItems({ userId });

    if (cartResult.empty || !cartResult.items?.length) {
      return {
        summary: 'Cart is empty. Ask which product they would like to add first.',
        handled: true,
      };
    }

    const { resolveShippingDetails } = await import('./tools.js');
    const { shipping, missing } = await resolveShippingDetails(userId, userName, userPrefs || {});

    if (missing.length > 0) {
      return {
        summary: `Customer wants to place order but missing: ${missing.join(', ')}. Ask for one detail at a time.`,
        handled: true,
      };
    }

    return {
      summary: 'Show the order summary card and ask the customer to confirm before placing the order.',
      pendingConfirmation: {
        type: 'place_order',
        items: cartResult.items,
        total: cartResult.total,
        shipping,
      },
      handled: true,
    };
  }

  return null;
}

export async function executeConfirmedAction(confirmAction, context = {}) {
  const { userId, userName, userPrefs } = context;
  const tools = await loadTools();

  if (!userId || userId === 'guest') {
    return {
      success: false,
      error: 'LOGIN_REQUIRED',
      message: 'Please log in to continue shopping.',
      actions: [{ type: 'login_required' }],
    };
  }

  if (confirmAction?.type === 'add_to_cart') {
    const result = await tools.addToCart({
      userId,
      productId: confirmAction.productId,
      productName: confirmAction.productName,
      quantity: confirmAction.quantity || 1,
    });

    if (result.success) {
      return {
        success: true,
        message: `Added ${result.productName} to your cart! ✨`,
        actions: result.action ? [result.action] : [{ type: 'cart_updated', productName: result.productName }],
      };
    }

    return {
      success: false,
      message: result.message || result.error || 'Could not add to cart.',
      actions: result.action ? [result.action] : [],
    };
  }

  if (confirmAction?.type === 'place_order') {
    const result = await tools.placeOrder({
      userId,
      userName,
      useCart: true,
      phone: confirmAction.phone || userPrefs?.phone,
      address: confirmAction.address || userPrefs?.address,
      city: confirmAction.city || userPrefs?.city,
      postalCode: confirmAction.postalCode || userPrefs?.postalCode,
      paymentMethod: confirmAction.paymentMethod || 'COD',
    });

    if (result.success) {
      return {
        success: true,
        message: `Order placed! ID: ${result.orderId.slice(0, 8).toUpperCase()} · Total: Rs. ${result.total} · COD`,
        actions: result.action ? [result.action] : [{ type: 'order_placed', orderId: result.orderId, total: result.total }],
        orderDetails: result,
      };
    }

    if (result.error === 'SHIPPING_REQUIRED') {
      return {
        success: false,
        message: `Please add your ${result.missing?.join(', ')} in your profile first.`,
      };
    }

    return {
      success: false,
      message: result.message || result.error || 'Could not place order.',
    };
  }

  return { success: false, message: 'Unknown action.' };
}
