async function loadTools() {
  const mod = await import('./_tools.js');
  return mod.tools;
}

const PLACE_ORDER_PATTERNS = [
  /place\s+(?:my\s+)?order/i,
  /order\s+(?:place|kar\w*|lag\w*)/i,
  /^checkout$/i,
  /cart\s+(?:se\s+)?order/i,
  /(?:mera|my)\s+order\s+kar/i,
];

const SKIN_TYPE_OPTIONS = [
  { id: 'dry', label: 'Dry Skin', emoji: '💧' },
  { id: 'oily', label: 'Oily Skin', emoji: '✨' },
  { id: 'combination', label: 'Combination', emoji: '🌸' },
  { id: 'sensitive', label: 'Sensitive', emoji: '🌿' },
  { id: 'hydrating', label: 'Hydration', emoji: '💦' },
];

/** Keywords used to rank products when DB skinTypes array is empty */
const SKIN_KEYWORDS = {
  dry: {
    strong: ['dry', 'very dry', 'rich cream', 'nourishing', 'milk cleanser', 'silk cream', 'comfort cream', 'barrier', 'ceramide'],
    soft: ['moisturizer', 'cream', 'hydrating', 'repair', 'overnight', 'softens'],
    avoid: ['oily', 'oil-control', 'salicylic', 'acne', 'pore', 'clarifying', 'foam cleanser', 'gel cleanser'],
  },
  oily: {
    strong: ['oily', 'oil', 'acne', 'salicylic', 'niacinamide', 'pore', 'clarifying', 'purifying', 'breakout', 'bha', 'aha'],
    soft: ['gel cleanser', 'foam', 'toner', 'matte', 'balancing'],
    avoid: ['very dry', 'rich cream', 'milk cleanser', 'silk cream'],
  },
  combination: {
    strong: ['combination', 'balance', 'hydra balance', 'pore minimizing', 'niacinamide'],
    soft: ['gel moisturizer', 'lightweight', 'toner', 'serum', 'normal to oily'],
    avoid: ['very dry', 'rich cream'],
  },
  sensitive: {
    strong: ['sensitive', 'gentle', 'mineral sunscreen', 'fragrance free', 'soothes', 'redness', 'calming', 'ultra-fine'],
    soft: ['aloe', 'barrier', 'cream cleanser', 'milk cleanser', 'ceramide', 'comfort'],
    avoid: ['glycolic', 'salicylic', 'aha', 'bha', 'exfoliating scrub', 'acne'],
  },
  hydrating: {
    strong: ['hydrat', 'hyaluronic', 'cloud dew', 'water burst', 'sheet mask', 'moisture', 'dew'],
    soft: ['serum', 'moisturizer', 'toner', 'aloe', 'panthenol', 'glow'],
    avoid: ['acne', 'clarifying', 'oil-control'],
  },
};

const SKIN_HINTS = {
  dry: 'Best picks for dry, thirsty skin',
  oily: 'Oil-control & clarifying picks',
  combination: 'Balanced care for combination skin',
  sensitive: 'Gentle formulas for sensitive skin',
  hydrating: 'Deep hydration & glow boosters',
};

const FIELD_PROMPTS = {
  phone: 'Great! To place your order, I need your **phone number** for delivery contact. 📱',
  address: 'Thank you! Now please share your **full delivery address** (house/street, area). 🏠',
  city: 'Almost done! Which **city** should we deliver to? 🌆',
};

const FIELD_LABELS = {
  phone: 'phone number',
  address: 'delivery address',
  city: 'city',
};

function isPlaceOrderIntent(message) {
  return PLACE_ORDER_PATTERNS.some((p) => p.test(String(message || '').trim()));
}

function parseSourceChoice(message) {
  const text = String(message || '').trim().toLowerCase();
  if (!text) return null;

  if (/^(cart|my cart|meri cart|cart se|from cart|cart wale|cart wala|cart products?)$/i.test(text)) {
    return 'cart';
  }
  if (/dry|sukhi|dry skin|dry skin ke/i.test(text)) return 'dry';
  if (/oily|chikni|oily skin|tel/i.test(text)) return 'oily';
  if (/combination|mixed|combo skin/i.test(text)) return 'combination';
  if (/sensitive|sensitive skin/i.test(text)) return 'sensitive';
  if (/hydrat|dehydrat|glow|moistur/i.test(text)) return 'hydrating';
  if (/browse|other|koi aur|alag|new product|shop|products/i.test(text)) return 'browse';
  return null;
}

function initShipping(userName, userPrefs) {
  const prefs = userPrefs && typeof userPrefs === 'object' ? userPrefs : {};
  return {
    name: userName || '',
    phone: prefs.phone || '',
    address: prefs.address || '',
    city: prefs.city || '',
    postalCode: prefs.postalCode || '',
    paymentMethod: 'COD',
  };
}

function getMissingFields(shipping) {
  const missing = [];
  if (!shipping.phone?.trim()) missing.push('phone');
  if (!shipping.address?.trim()) missing.push('address');
  if (!shipping.city?.trim()) missing.push('city');
  return missing;
}

function parseFieldValue(message, field) {
  const text = String(message || '').trim();
  if (!text) return null;

  if (field === 'phone') {
    const digits = text.replace(/\D/g, '');
    if (digits.length >= 10 && digits.length <= 13) return digits.slice(-11);
    return null;
  }

  if (field === 'address') {
    if (text.length >= 8 && !/^\d+$/.test(text)) return text;
    return null;
  }

  if (field === 'city') {
    if (text.length >= 2 && text.length <= 60 && !/^\d+$/.test(text)) return text;
    return null;
  }

  return null;
}

/** True when user is asking something else — not answering the current order step */
function isOffTopicFromOrder(message, { step, askingField } = {}) {
  const text = String(message || '').trim();
  if (!text) return false;

  // Explicit cancel / pause order
  if (/^(cancel|band|rok|stop)\s*(order|karo|krdo)?$/i.test(text)) return false; // handled separately
  if (/cancel\s+order|order\s+cancel|baad\s+mein|later|pehly|pehle\s+ye|wait/i.test(text) && !parseFieldValue(text, askingField)) {
    return true;
  }

  // Clear questions / advice requests
  if (/\?/.test(text)) return true;
  if (/^(how|what|why|when|which|where|who|best|recommend|suggest|tell me|can you|could you|help|kya|kaise|kese|konsa|konsi|mujhe batao|batao)/i.test(text)) {
    return true;
  }
  if (/\b(routine|acne|serum|ingredient|spf|sunscreen|moisturizer for|skin care|skincare|dry skin|oily skin|recommend|suggest|advice|tips|benefit|side effect)\b/i.test(text)) {
    // Allow if they're clearly answering address/city with those words unlikely
    if (askingField === 'phone') return true;
    if (askingField === 'city' && text.length < 40 && !/\b(routine|acne|serum|recommend|advice)\b/i.test(text)) {
      return false; // short city-like text
    }
    if (askingField === 'address' && text.length >= 8 && !/\?/.test(text) && !/^(how|what|best)/i.test(text)) {
      return false; // likely an address
    }
    return true;
  }

  // During collect_details: if value doesn't parse AND message is long / sentence-like → off topic
  if (step === 'collect_details' && askingField) {
    if (parseFieldValue(text, askingField)) return false;
    // Phone step: short digit attempts stay in order flow; wordy messages are off-topic
    if (askingField === 'phone') {
      const digits = text.replace(/\D/g, '');
      if (digits.length >= 5 && !/[a-zA-Z]{4,}/.test(text)) return false;
      return true;
    }
    // City: multi-word questions
    if (askingField === 'city' && (text.split(/\s+/).length > 4 || /\b(hai|hain|karo|batao|chahiye|routine|serum|best)\b/i.test(text))) {
      return true;
    }
    // Address: question words mean off-topic
    if (askingField === 'address' && /\b(batao|recommend|best|kya|kaise|routine|serum|moisturizer|acne)\b/i.test(text)) {
      return true;
    }
  }

  // During choose_source / select_product: questions or advice without product/order intent
  if (step === 'choose_source' || step === 'select_product') {
    if (parseSourceChoice(text) || extractProductFromOrderMessage(text) || isPlaceOrderIntent(text)) {
      return false;
    }
    if (looksLikeProductName(text) && text.split(/\s+/).length <= 6) return false;
    if (text.split(/\s+/).length >= 4 || /\b(hai|hain|batao|chahiye|routine|best)\b/i.test(text)) {
      return true;
    }
  }

  return false;
}

function isCancelOrderIntent(message) {
  return /^(cancel|band karo|rok do|stop)$/i.test(String(message || '').trim())
    || /cancel\s+(my\s+)?order|order\s+cancel|order\s+mat|nahi\s+order/i.test(String(message || ''));
}

function calcTotal(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  return Math.round(subtotal * 1.05);
}

function buildOrderConfirmation(orderDraft) {
  return {
    type: 'place_order',
    items: orderDraft.items,
    total: orderDraft.total,
    shipping: orderDraft.shipping,
    productId: orderDraft.items?.[0]?.productId,
    useCart: orderDraft.useCart ?? false,
  };
}

function extractProductFromOrderMessage(message) {
  const text = String(message || '').trim();
  if (!text) return null;

  const patterns = [
    /(?:order|buy|purchase)\s+(?:the\s+)?(.+?)(?:\s+please|\s+for me|\s+now|$)/i,
    /(.+?)\s+(?:ka|ki|ke)\s+order\s+(?:kar\w*|kr\w*|lag\w*|place|chahiye)/i,
    /(?:maine|mujhe|i want to|i'd like to|want to)\s+(?:order\s+)?(.+?)(?:\s+order|\s+kr\w*|\s+chahiye|$)/i,
    /(.+?)\s+(?:order|buy)\s+(?:kar\w*|kr\w*|karna|krna|chahiye)/i,
    /(?:order|buy)\s+(?:for\s+)?(.+)/i,
  ];

  const stripWords = /\b(please|plz|karo|kar do|kr do|order|buy|mujhe|mere liye|maine|iska|uska|ye|yeh|the|a|an|krna|karna|hai|chahiye|lena|purchase|place|my|mera)\b/gi;

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match?.[1]) continue;
    const query = match[1].replace(stripWords, '').replace(/\s+/g, ' ').trim();
    if (query.length >= 3 && !/^(cart|dry|oily|sensitive|combination|hydrat|skin|place)/i.test(query)) {
      return query;
    }
  }

  if (/order|buy|purchase|chahiye|lena|krna|karna/i.test(text) && !isPlaceOrderIntent(text)) {
    const cleaned = text
      .replace(/\b(place|my|mera|order|kar\w*|kr\w*|krna|karna|buy|purchase|please|mujhe|maine|chahiye|lena|hai|for me|want to|i want|the)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleaned.length >= 4 && !/^(cart|dry|oily|sensitive|skin|combination)/i.test(cleaned)) {
      return cleaned;
    }
  }

  return null;
}

function looksLikeProductName(message) {
  const text = String(message || '').trim();
  if (text.length < 4) return false;
  if (parseSourceChoice(text)) return false;
  if (isPlaceOrderIntent(text)) return false;
  if (/^(yes|no|ok|cancel|nahi|haan)$/i.test(text)) return false;
  return /[a-zA-Z]{3,}/.test(text);
}

async function resolveProductByName(query, orderDraft, context) {
  const { userName, userPrefs } = context;
  const baseDraft = {
    ...orderDraft,
    shipping: orderDraft?.shipping || initShipping(userName, userPrefs),
    step: 'select_product',
  };

  const toolsMod = await import(`./_tools.js?t=${Date.now()}`);
  const findProduct = toolsMod.findProduct;
  const found = findProduct ? await findProduct({ query }) : null;

  if (found && found.stock > 0) {
    return selectProductForOrder(found.id, baseDraft, context);
  }

  const tools = await loadTools();
  const results = await tools.searchProducts({ query });
  const inStock = Array.isArray(results) ? results.filter((p) => p.inStock) : [];

  if (inStock.length === 1) {
    return selectProductForOrder(inStock[0].id, baseDraft, context);
  }

  if (inStock.length > 1) {
    return {
      handled: true,
      reply: `I found a few matches for **"${query}"** — tap the one you'd like to order. ✨`,
      orderDraft: baseDraft,
      productPicker: { products: inStock.slice(0, 4), hint: `Results for "${query}"` },
    };
  }

  const products = await getRecommendedProducts();
  return {
    handled: true,
    reply: `I couldn't find **"${query}"** in our store. Check the spelling, pick by skin type below, or choose from popular products. ✨`,
    orderDraft: baseDraft,
    productPicker: { products, hint: 'Popular picks' },
  };
}

function buildSourceChoiceResponse(cartResult, orderDraft, reply) {
  const hasCart = !cartResult.empty && cartResult.items?.length > 0;
  return {
    handled: true,
    reply,
    orderDraft: {
      ...orderDraft,
      step: 'choose_source',
      cartSnapshot: hasCart ? {
        itemCount: cartResult.items.length,
        total: cartResult.total,
        preview: cartResult.items.slice(0, 3).map((i) => i.name),
      } : null,
    },
    orderSourceChoice: {
      hasCart,
      cartItemCount: hasCart ? cartResult.items.length : 0,
      cartTotal: hasCart ? cartResult.total : 0,
      cartPreview: hasCart ? cartResult.items.slice(0, 3).map((i) => i.name) : [],
      skinTypes: SKIN_TYPE_OPTIONS,
      showProductHint: true,
    },
  };
}

async function getRecommendedProducts() {
  return getProductsBySkinType('hydrating');
}

function scoreProductForSkin(product, skinKey) {
  const cfg = SKIN_KEYWORDS[skinKey] || SKIN_KEYWORDS.hydrating;
  const haystack = [
    product.name,
    product.category,
    product.description,
    ...(product.benefits || []),
    ...(product.skinTypes || []),
  ].join(' ').toLowerCase();

  let score = 0;

  // Explicit skinTypes array match (when available)
  if ((product.skinTypes || []).some((s) => String(s).toLowerCase().includes(skinKey.replace('hydrating', 'hydrat')))) {
    score += 12;
  }

  for (const word of cfg.strong) {
    if (haystack.includes(word.toLowerCase())) score += 5;
  }
  for (const word of cfg.soft) {
    if (haystack.includes(word.toLowerCase())) score += 2;
  }
  for (const word of cfg.avoid) {
    if (haystack.includes(word.toLowerCase())) score -= 4;
  }

  return score;
}

function mapProductCard(p) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    imageUrl: p.imageUrl,
    category: p.category,
    benefits: p.benefits || [],
    inStock: p.stock > 0,
  };
}

async function getProductsBySkinType(skinKey) {
  const { default: prisma } = await import('../_db.js');

  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { createdAt: 'desc' },
  });

  const ranked = products
    .map((p) => ({ product: p, score: scoreProductForSkin(p, skinKey) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked = [];
  const seen = new Set();

  for (const row of ranked) {
    if (seen.has(row.product.id)) continue;
    seen.add(row.product.id);
    picked.push(mapProductCard(row.product));
    if (picked.length >= 4) break;
  }

  // If fewer than 4 matches, fill with other in-stock products (still skip already picked)
  if (picked.length < 4) {
    for (const p of products) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      picked.push(mapProductCard(p));
      if (picked.length >= 4) break;
    }
  }

  return picked;
}

async function startCartCheckout(cartResult, userName, userPrefs) {
  const shipping = initShipping(userName, userPrefs);
  const missing = getMissingFields(shipping);
  const nextDraft = {
    step: missing.length ? 'collect_details' : 'confirm',
    items: cartResult.items,
    total: cartResult.total,
    shipping,
    useCart: true,
    askingField: missing[0] || null,
  };

  if (missing.length === 0) {
    return {
      handled: true,
      reply: 'Your cart is ready! Please review the order summary below and tap **Yes, Place Order** to confirm. ✨',
      orderDraft: nextDraft,
      pendingConfirmation: buildOrderConfirmation(nextDraft),
    };
  }

  return {
    handled: true,
    reply: `Perfect — I'll order your **${cartResult.items.length} cart item${cartResult.items.length > 1 ? 's' : ''}**. ${FIELD_PROMPTS[missing[0]]}`,
    orderDraft: nextDraft,
    orderProgress: { collected: shipping, missing, current: missing[0] },
  };
}

async function showSkinTypeProducts(skinKey, orderDraft, userName, userPrefs) {
  const products = await getProductsBySkinType(skinKey);
  const label = SKIN_TYPE_OPTIONS.find((s) => s.id === skinKey)?.label || 'your skin';
  const hint = SKIN_HINTS[skinKey] || 'Recommended for you';

  return {
    handled: true,
    reply: `Here are top picks for **${label}** — tap a product to order, or tell me another skin concern. ✨`,
    orderDraft: {
      ...orderDraft,
      step: 'select_product',
      skinType: skinKey,
      shipping: orderDraft.shipping || initShipping(userName, userPrefs),
    },
    productPicker: { products, hint, skinType: skinKey },
  };
}

export async function handleOrderSourceChoice(choice, orderDraft, context) {
  const { userId, userName, userPrefs } = context;
  if (!userId || userId === 'guest') {
    return {
      handled: true,
      reply: 'Please log in first to place an order.',
      actions: [{ type: 'login_required' }],
      orderDraft: null,
    };
  }

  const tools = await loadTools();
  const cartResult = await tools.getCartItems({ userId });
  const baseDraft = {
    shipping: orderDraft?.shipping || initShipping(userName, userPrefs),
  };

  if (choice === 'cart') {
    if (cartResult.empty || !cartResult.items?.length) {
      return showSkinTypeProducts('hydrating', { ...baseDraft, step: 'select_product' }, userName, userPrefs);
    }
    return startCartCheckout(cartResult, userName, userPrefs);
  }

  if (choice === 'browse') {
    const products = await getRecommendedProducts();
    return {
      handled: true,
      reply: 'Browse our popular products below — tap one to order, or tell me your skin type (dry, oily, sensitive). ✨',
      orderDraft: { ...baseDraft, step: 'select_product' },
      productPicker: { products, hint: 'Popular SkinGlow picks' },
      orderSourceChoice: {
        hasCart: !cartResult.empty,
        cartItemCount: cartResult.items?.length || 0,
        cartTotal: cartResult.total || 0,
        cartPreview: cartResult.items?.slice(0, 3).map((i) => i.name) || [],
        skinTypes: SKIN_TYPE_OPTIONS,
      },
    };
  }

  if (SKIN_KEYWORDS[choice]) {
    return showSkinTypeProducts(choice, baseDraft, userName, userPrefs);
  }

  return buildSourceChoiceResponse(
    cartResult,
    baseDraft,
    'Would you like to order from your **cart**, or pick products for your skin type? Choose below or tell me (e.g. "dry skin" or "cart"). ✨'
  );
}

export async function selectProductForOrder(productId, orderDraft, context) {
  const { userId, userName, userPrefs } = context;
  if (!userId || userId === 'guest') {
    return {
      handled: true,
      reply: 'Please log in first to place an order.',
      actions: [{ type: 'login_required' }],
      orderDraft: null,
    };
  }

  let selected = null;

  if (productId) {
    const { default: prisma } = await import('../_db.js');
    selected = await prisma.product.findUnique({ where: { id: productId } });
  }

  if (!selected) {
    const skinKey = orderDraft?.skinType || 'hydrating';
    const products = await getProductsBySkinType(skinKey);
    return {
      handled: true,
      reply: 'Sorry, I could not find that product. Please pick another one from the list.',
      orderDraft: { step: 'select_product', skinType: skinKey, shipping: initShipping(userName, userPrefs) },
      productPicker: { products, hint: SKIN_HINTS[skinKey] || 'Choose a product' },
    };
  }

  const items = [{
    productId: selected.id,
    name: selected.name,
    price: selected.price,
    quantity: 1,
    imageUrl: selected.imageUrl,
  }];

  const shipping = orderDraft?.shipping || initShipping(userName, userPrefs);
  const missing = getMissingFields(shipping);
  const nextDraft = {
    step: missing.length ? 'collect_details' : 'confirm',
    items,
    total: calcTotal(items),
    shipping,
    useCart: false,
    askingField: missing[0] || null,
    skinType: orderDraft?.skinType || null,
  };

  if (missing.length === 0) {
    return {
      handled: true,
      reply: `Perfect choice — **${selected.name}**! Please review your order summary below and tap **Yes, Place Order** to confirm. ✨`,
      orderDraft: nextDraft,
      pendingConfirmation: buildOrderConfirmation(nextDraft),
    };
  }

  return {
    handled: true,
    reply: `Excellent choice — **${selected.name}** (Rs. ${selected.price})! ${FIELD_PROMPTS[missing[0]]}`,
    orderDraft: nextDraft,
    orderProgress: { collected: shipping, missing, current: missing[0] },
  };
}

export async function processOrderFlow({ message, orderDraft, context }) {
  const { userId, userName, userPrefs } = context;
  const tools = await loadTools();

  if (!userId || userId === 'guest') {
    if (isPlaceOrderIntent(message) || orderDraft?.step) {
      return {
        handled: true,
        reply: 'Please log in to place an order. Once logged in, I\'ll guide you through every step.',
        actions: [{ type: 'login_required' }],
        orderDraft: null,
      };
    }
    return null;
  }

  const cartResult = await tools.getCartItems({ userId });
  const hasCart = !cartResult.empty && cartResult.items?.length > 0;

  // User wants to cancel the in-progress order
  if (orderDraft?.step && isCancelOrderIntent(message)) {
    return {
      handled: true,
      reply: 'No problem — I\'ve cancelled the order for now. Ask me anything about skincare, or say **"place my order"** whenever you\'re ready again. ✨',
      orderDraft: null,
    };
  }

  // Collect shipping details
  if (orderDraft?.step === 'collect_details' && orderDraft.askingField) {
    const field = orderDraft.askingField;

    // User asked something else — pause order, let normal AI answer
    if (isOffTopicFromOrder(message, { step: 'collect_details', askingField: field })) {
      return null;
    }

    const value = parseFieldValue(message, field);

    if (!value) {
      return {
        handled: true,
        reply: `I still need your **${FIELD_LABELS[field] || field}** to continue the order.\n\n${FIELD_PROMPTS[field]}\n\nOr ask me anything else about skincare — your order will wait. You can also say **cancel order**.`,
        orderDraft,
        orderProgress: {
          collected: orderDraft.shipping,
          missing: getMissingFields(orderDraft.shipping),
          current: field,
        },
      };
    }

    const shipping = { ...orderDraft.shipping, [field]: value };
    const missing = getMissingFields(shipping);
    const nextDraft = { ...orderDraft, shipping, askingField: missing[0] || null };

    if (missing.length === 0) {
      nextDraft.step = 'confirm';
      return {
        handled: true,
        reply: 'Thank you! Here is your complete order summary. Please review everything and tap **Yes, Place Order** to confirm. ✨',
        orderDraft: nextDraft,
        pendingConfirmation: buildOrderConfirmation(nextDraft),
        orderProgress: { collected: shipping, missing: [], current: null },
      };
    }

    nextDraft.step = 'collect_details';
    return {
      handled: true,
      reply: FIELD_PROMPTS[missing[0]],
      orderDraft: nextDraft,
      orderProgress: { collected: shipping, missing, current: missing[0] },
    };
  }

  // Choose cart vs skin-type products
  if (orderDraft?.step === 'choose_source') {
    if (isOffTopicFromOrder(message, { step: 'choose_source' })) {
      return null;
    }

    const choice = parseSourceChoice(message);
    if (choice) {
      return handleOrderSourceChoice(choice, orderDraft, context);
    }

    const productQuery = extractProductFromOrderMessage(message) || (looksLikeProductName(message) ? message.trim() : null);
    if (productQuery) {
      return resolveProductByName(productQuery, orderDraft, context);
    }

    return buildSourceChoiceResponse(
      cartResult,
      orderDraft,
      'Choose an option below, **type a product name** (e.g. "Hydra Balance Cleanser"), or say **"dry skin"** / **"cart"**. ✨'
    );
  }

  // Product selection — user can type skin type, product name, or pick from cards
  if (orderDraft?.step === 'select_product') {
    if (isOffTopicFromOrder(message, { step: 'select_product' })) {
      return null;
    }

    const choice = parseSourceChoice(message);
    if (choice === 'cart' && hasCart) {
      return startCartCheckout(cartResult, userName, userPrefs);
    }
    if (choice && choice !== 'cart' && choice !== 'browse') {
      return showSkinTypeProducts(choice, orderDraft, userName, userPrefs);
    }
    if (choice === 'browse') {
      const products = await getRecommendedProducts();
      return {
        handled: true,
        reply: 'Here are our popular products — tap one to order. ✨',
        orderDraft,
        productPicker: { products, hint: 'Popular SkinGlow picks' },
      };
    }

    const productQuery = extractProductFromOrderMessage(message) || message.trim();
    if (productQuery.length >= 3) {
      return resolveProductByName(productQuery, orderDraft, context);
    }

    const skinKey = orderDraft.skinType || 'hydrating';
    const products = await getProductsBySkinType(skinKey);
    return {
      handled: true,
      reply: 'Tap a product below, **type a product name**, tell me your skin type, or say **"cart"** to order cart items. ✨',
      orderDraft,
      productPicker: { products, hint: SKIN_HINTS[skinKey] || 'Choose a product' },
      orderSourceChoice: hasCart ? {
        hasCart: true,
        cartItemCount: cartResult.items.length,
        cartTotal: cartResult.total,
        cartPreview: cartResult.items.slice(0, 3).map((i) => i.name),
        skinTypes: SKIN_TYPE_OPTIONS,
        showProductHint: true,
      } : null,
    };
  }

  // Direct product name order — "Hydra Cleanser order krna hai"
  const namedQuery = extractProductFromOrderMessage(message);
  if (namedQuery && /order|buy|purchase|chahiye|lena|krna|karna/i.test(message)) {
    return resolveProductByName(namedQuery, { shipping: initShipping(userName, userPrefs) }, context);
  }

  // Skin-type order intent without full place-order phrase
  const skinChoice = parseSourceChoice(message);
  if (skinChoice && skinChoice !== 'cart' && skinChoice !== 'browse' && /order|buy|chahiye|lena|purchase/i.test(message)) {
    return showSkinTypeProducts(skinChoice, { shipping: initShipping(userName, userPrefs) }, userName, userPrefs);
  }

  // Start new order flow
  if (!isPlaceOrderIntent(message)) return null;

  const baseDraft = { shipping: initShipping(userName, userPrefs) };

  if (hasCart) {
    return buildSourceChoiceResponse(
      cartResult,
      baseDraft,
      'I\'d love to help you place an order! You can:\n\n• Order **from your cart**\n• Pick by **skin type** (dry, oily, sensitive…)\n• **Type a product name** (e.g. "Hydra Balance Cleanser order krna hai")\n\nChoose below or tell me what you need. ✨'
    );
  }

  // Empty cart — ask skin type or product name
  const products = await getRecommendedProducts();
  return {
    handled: true,
    reply: 'Let\'s find the perfect product! Tell me your **skin type**, **type a product name**, or tap a product below. ✨',
    orderDraft: { ...baseDraft, step: 'select_product' },
    productPicker: { products, hint: 'Popular picks — or type any product name' },
    orderSourceChoice: {
      hasCart: false,
      cartItemCount: 0,
      cartTotal: 0,
      cartPreview: [],
      skinTypes: SKIN_TYPE_OPTIONS,
      showProductHint: true,
    },
  };
}

export async function executeOrderConfirmation(confirmAction, context) {
  const tools = await loadTools();
  const { userId, userName } = context;

  const result = await tools.placeOrder({
    userId,
    userName,
    useCart: confirmAction.useCart ?? false,
    productId: confirmAction.productId,
    phone: confirmAction.phone,
    address: confirmAction.address,
    city: confirmAction.city,
    postalCode: confirmAction.postalCode,
    paymentMethod: confirmAction.paymentMethod || 'COD',
  });

  if (result.success) {
    const shortId = result.orderId.slice(0, 8).toUpperCase();
    return {
      success: true,
      message: `Your order is confirmed! 🎉\n\n**Order ID:** ${shortId}\n**Total:** Rs. ${result.total}\n**Payment:** Cash on Delivery\n\nYou can track it anytime in **My Orders**.`,
      actions: [{ type: 'order_placed', orderId: result.orderId, total: result.total }],
      orderDetails: result,
      orderDraft: null,
    };
  }

  if (result.error === 'SHIPPING_REQUIRED') {
    return {
      success: false,
      message: `Please provide your ${result.missing?.join(', ')} to complete the order.`,
      orderDraft: { step: 'collect_details', askingField: result.missing?.[0] },
    };
  }

  return {
    success: false,
    message: result.message || result.error || 'Could not place order. Please try again.',
  };
}
