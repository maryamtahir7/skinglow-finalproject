import prisma from '../_db.js';

async function loadTools() {
  const mod = await import('./_tools.js');
  return mod.tools;
}

const RECOMMEND_PATTERNS = [
  /recommend/i,
  /suggest/i,
  /best\s+.+\s+(?:for|product|from)/i,
  /(?:any|some|koi)\s+.+\s+product/i,
  /(?:show|dikha|bata)\s+.+\s+product/i,
  /product\s+(?:from\s+)?(?:your\s+)?(?:site|store|skinglow)/i,
  /what\s+(?:should|can)\s+i\s+(?:use|buy|try)/i,
  /kons[ai]\s+product/i,
  /mujhe\s+.+\s+(?:chahiye|recommend)/i,
];

const CONCERN_QUERIES = [
  { re: /hydrat|dehydrat|moisture|thirsty/i, query: 'hydrat', skinType: 'hydrating', label: 'hydration' },
  { re: /dry\s*skin|sukhi/i, query: 'dry', skinType: 'dry', label: 'dry skin' },
  { re: /oil(?:y)?\s*skin|acne|breakout|pimple/i, query: 'oily', skinType: 'oily', label: 'oily / acne-prone skin' },
  { re: /sensitive|redness|irritat/i, query: 'sensitive', skinType: 'sensitive', label: 'sensitive skin' },
  { re: /combination|combo\s*skin/i, query: 'combination', skinType: 'combination', label: 'combination skin' },
  { re: /serum/i, query: 'serum', label: 'serums' },
  { re: /cleanser|face\s*wash/i, query: 'cleanser', label: 'cleansers' },
  { re: /moistur/i, query: 'moisturizer', label: 'moisturizers' },
  { re: /sunscreen|spf/i, query: 'sunscreen', label: 'sunscreens' },
  { re: /mask/i, query: 'mask', label: 'masks' },
  { re: /toner/i, query: 'toner', label: 'toners' },
  { re: /vitamin\s*c|brighten|glow/i, query: 'vitamin c', label: 'brightening' },
  { re: /niacinamide|pore/i, query: 'niacinamide', label: 'pore care' },
];

export function isRecommendationIntent(message) {
  const text = String(message || '').trim();
  if (!text || text.length < 4) return false;
  // Don't steal cart/order intents
  if (/place\s+(?:my\s+)?order|cart\s*mein|add\s+.+\s+to\s+cart/i.test(text)) return false;
  return RECOMMEND_PATTERNS.some((p) => p.test(text))
    || /(?:best|good|top)\s+(?:\w+\s+){0,3}(?:product|moisturizer|serum|cleanser|cream|mask)/i.test(text)
    || /(?:product|moisturizer|serum|cleanser).*(?:for|from)/i.test(text);
}

function resolveConcern(message) {
  const text = String(message || '');
  for (const concern of CONCERN_QUERIES) {
    if (concern.re.test(text)) return concern;
  }
  return { query: 'moisturizer serum', label: 'skincare' };
}

function scoreProduct(product, query, skinType) {
  const hay = [
    product.name,
    product.category,
    product.description,
    ...(product.benefits || []),
    ...(product.skinTypes || []),
  ].join(' ').toLowerCase();

  let score = 0;
  const terms = String(query || '').toLowerCase().split(/\s+/).filter(Boolean);
  for (const t of terms) {
    if (hay.includes(t)) score += 4;
  }
  if (skinType && hay.includes(skinType.replace('hydrating', 'hydrat'))) score += 6;

  // Extra hydration boosters
  if (/hydrat|moisture|dew|hyaluronic|water burst|cloud dew|sheet mask/i.test(hay)) {
    if (/hydrat|moisture/i.test(query) || skinType === 'hydrating') score += 5;
  }
  if (product.inStock === false || product.stock === 0) score -= 20;

  return score;
}

/**
 * Returns real catalog products for recommendation requests.
 */
export async function previewProductRecommendations(message) {
  if (!isRecommendationIntent(message)) return null;

  const concern = resolveConcern(message);
  const tools = await loadTools();

  // Pull a wider set, then rank (skinTypes often empty in DB)
  // using top-level prisma import
  const all = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    take: 60,
    orderBy: { createdAt: 'desc' },
  });

  const ranked = all
    .map((p) => ({
      product: {
        id: p.id,
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl,
        category: p.category,
        benefits: p.benefits || [],
        description: p.description,
        skinTypes: p.skinTypes || [],
        inStock: p.stock > 0,
      },
      score: scoreProduct(p, concern.query, concern.skinType),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  let products = ranked.slice(0, 4).map((r) => r.product);

  // Fallback: tool search
  if (products.length < 2) {
    const results = await tools.searchProducts({
      query: concern.query,
      skinType: concern.skinType && concern.skinType !== 'hydrating' ? concern.skinType : undefined,
    });
    if (Array.isArray(results)) {
      const extra = results.filter((p) => p.inStock && !products.some((x) => x.id === p.id));
      products = [...products, ...extra].slice(0, 4);
    }
  }

  if (!products.length) {
    return {
      handled: true,
      reply: `I couldn't find matching products for that right now. Try browsing our shop, or tell me another concern (dry, oily, sensitive). ✨`,
      productPicker: null,
    };
  }

  const lines = products.map((p, i) => `${i + 1}. **${p.name}** — Rs. ${Number(p.price).toLocaleString()}`).join('\n');

  return {
    handled: true,
    reply: `Here are real SkinGlow picks for **${concern.label}** from our store — tap a card to open the product page:\n\n${lines}\n\nYou can also say **"add [product] to cart"** or **"place my order"** anytime. ✨`,
    productPicker: {
      products,
      hint: `From our store · ${concern.label}`,
      mode: 'browse', // click opens product page
    },
  };
}
