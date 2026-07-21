const TOOL_NAMES = [
  'searchProducts',
  'addToCart',
  'getCartItems',
  'placeOrder',
  'getOrderStatus',
  'updateSkinProfile',
  'getTopSellingProducts',
  'getLowStockProducts',
];

/**
 * Strip every form of leaked tool / function call markup from model text.
 * Covers formats like:
 *   <function=searchProducts{"query":"x"}</function>
 *   <function=searchProducts>{"query":"x"}</function>
 *   tool call JSON blobs, invoke tags, etc.
 */
export function sanitizeAIResponse(text) {
  if (!text) return '';

  let cleaned = String(text);

  const stripPatterns = [
    // <function=name{...}</function>  (no > after name — Groq leak style)
    /<function=\w+\s*\{[\s\S]*?\}\s*<\/function>/gi,
    // <function=name>...</function>
    /<function=[^>\n]+>[\s\S]*?<\/function>/gi,
    // Unclosed <function=...
    /<function=\w+\s*\{[\s\S]*$/gi,
    /<function=[^<\n]*/gi,
    /<\/function>/gi,

    /<tool_call>[\s\S]*?<\/tool_call>/gi,
    /<\/?tool_call>/gi,
    /<invoke\s+name="[^"]+"[^>]*>[\s\S]*?<\/invoke>/gi,
    /\[FUNCTION_CALL:[^\]]+\][\s\S]*?\[\/FUNCTION_CALL\]/gi,

    // ```json / tool blocks that look like tool args
    /```(?:json|tool|function)?\s*[\s\S]*?```/gi,

    // run tool foo with ...
    /(?:run|call|use)\s+tool\s+\w+[^\n]*/gi,
  ];

  for (const pattern of stripPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Bare toolName({...}) or toolName{"..."}
  for (const name of TOOL_NAMES) {
    const reParen = new RegExp(`\\b${name}\\s*\\([^)]*\\)`, 'gi');
    const reBrace = new RegExp(`\\b${name}\\s*\\{[\\s\\S]*?\\}`, 'gi');
    cleaned = cleaned.replace(reParen, '');
    cleaned = cleaned.replace(reBrace, '');
  }

  // Leftover JSON-looking tool arg fragments on their own line
  cleaned = cleaned.replace(/^\s*\{[^{}]*"(?:query|skinType|productId|userId)"[^{}]*\}\s*$/gm, '');

  cleaned = cleaned
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  // If sanitizing wiped everything useful, fall back empty (caller has default)
  if (!cleaned || /^[\s{}[\]"'`,;:]*$/.test(cleaned)) {
    return '';
  }

  return cleaned;
}

export function buildUserContext({ userName, userId, userPrefs }) {
  const parts = [];

  if (userId && userId !== 'guest' && userName) {
    const firstName = userName.trim().split(/\s+/)[0];
    parts.push(`The customer is logged in as ${firstName}. They can add to cart and place orders.`);
  } else {
    parts.push('The customer is a guest. They must log in before adding to cart or placing orders.');
  }

  if (userPrefs?.phone || userPrefs?.address || userPrefs?.city) {
    const details = [];
    if (userPrefs.phone) details.push(`phone: ${userPrefs.phone}`);
    if (userPrefs.address) details.push(`address: ${userPrefs.address}`);
    if (userPrefs.city) details.push(`city: ${userPrefs.city}`);
    if (userPrefs.postalCode) details.push(`postal: ${userPrefs.postalCode}`);
    parts.push(`Saved delivery details — ${details.join(', ')}. Use these for placeOrder unless user provides new ones.`);
  }

  return parts.join(' ');
}
