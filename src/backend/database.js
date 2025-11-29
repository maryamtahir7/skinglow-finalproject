import { databases } from "./appwrite";
import { Query } from "appwrite";

/* --------------------- PRODUCTS --------------------- */
export async function addProduct(product) {
  return databases.createDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_TABLE_ID,
    "unique()",
    product
  );
}

export async function getProducts() {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_TABLE_ID
  );
}

export async function getProductById(productId) {
  return databases.getDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_TABLE_ID,
    String(productId)
  );
}

export async function updateProduct(productId, updates) {
  return databases.updateDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_TABLE_ID,
    String(productId),
    updates
  );
}

export async function deleteProduct(productId) {
  return databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_TABLE_ID,
    String(productId)
  );
}

/* --------------------- CATEGORIES --------------------- */
export async function addCategory(category) {
  return databases.createDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_CATEGORIES_ID,
    "unique()",
    category
  );
}

export async function getCategories() {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_CATEGORIES_ID
  );
}

export async function getCategoryById(categoryId) {
  return databases.getDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_CATEGORIES_ID,
    String(categoryId)
  );
}

export async function updateCategory(categoryId, updates) {
  return databases.updateDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_CATEGORIES_ID,
    String(categoryId),
    updates
  );
}

export async function deleteCategory(categoryId) {
  return databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_CATEGORIES_ID,
    String(categoryId)
  );
}

/* --------------------- HELPERS --------------------- */
export async function getProductsByIds(ids = []) {
  if (!Array.isArray(ids) || !ids.length) return { documents: [] };

  const products = await Promise.all(
    ids.map((id) =>
      databases
        .getDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_TABLE_ID,
          String(id)
        )
        .catch(() => null)
    )
  );

  return { documents: products.filter(Boolean) };
}

/* --------------------- CART --------------------- */
export async function getCart(userId) {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_CART_ID,
    [Query.equal("userId", String(userId)), Query.orderDesc("$createdAt")]
  );
}

export async function addToCart({ userId, productId, quantity = 1 }) {
  const existing = await databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_CART_ID,
    [Query.equal("userId", String(userId)), Query.equal("productId", String(productId))]
  );

  if (existing.total > 0) {
    const doc = existing.documents[0];
    return databases.updateDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_CART_ID,
      doc.$id,
      { quantity: (doc.quantity || 0) + quantity }
    );
  }

  return databases.createDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_CART_ID,
    "unique()",
    { userId: String(userId), productId: String(productId), quantity }
  );
}

export async function setCartItemQuantity(cartItemId, quantity) {
  return databases.updateDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_CART_ID,
    String(cartItemId),
    { quantity }
  );
}

export async function removeFromCart(cartItemId) {
  return databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_CART_ID,
    String(cartItemId)
  );
}

export async function clearCart(userId) {
  const list = await getCart(userId);
  if (!list.documents.length) return;
  await Promise.all(
    list.documents.map((d) =>
      databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_CART_ID,
        d.$id
      )
    )
  );
}

/* --------------------- WISHLIST --------------------- */
export async function getWishlist(userId) {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_WISHLIST_ID,
    [Query.equal("userId", String(userId)), Query.orderDesc("$createdAt")]
  );
}

export async function addToWishlist({ userId, productId }) {
  const existing = await databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_WISHLIST_ID,
    [Query.equal("userId", String(userId)), Query.equal("productId", String(productId))]
  );

  if (existing.total > 0) return existing.documents[0];

  return databases.createDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_WISHLIST_ID,
    "unique()",
    { userId: String(userId), productId: String(productId) }
  );
}

export async function removeFromWishlist(wishlistItemId) {
  return databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_WISHLIST_ID,
    String(wishlistItemId)
  );
}

/* --------------------- ORDERS --------------------- */
export async function createOrder({
  userId,
  items,
  total,
  name,
  phone,
  address,
  city,
  postalCode,
  notes = "",
  paymentMethod = "COD",
  status = "pending",
}) {
  if (!userId || !items || !total || !name || !phone || !address || !city || !postalCode) {
    throw new Error("Missing required order fields");
  }

  const payload = {
    userId: String(userId),
    items: JSON.stringify(items),
    total: Number(total),
    name: String(name),
    phone: String(phone),
    address: String(address),
    city: String(city),
    postalCode: String(postalCode),
    notes: String(notes),
    paymentMethod: String(paymentMethod),
    status: String(status),
  };

  return databases.createDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_ORDERS_ID,
    "unique()",
    payload
  );
}

export async function getOrders() {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_ORDERS_ID,
    [Query.orderDesc("$createdAt")]
  );
}

export async function updateOrder(orderId, updates) {
  updates.$updatedAt = new Date().toISOString();
  return databases.updateDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_ORDERS_ID,
    String(orderId),
    updates
  );
}

export async function deleteOrder(orderId) {
  return databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_ORDERS_ID,
    String(orderId)
  );
}

/* --------------------- STOCK --------------------- */
export async function addStock(stock) {
  return databases.createDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_STOCK_ID,
    "unique()",
    stock
  );
}

export async function getStocks() {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_STOCK_ID,
    [Query.orderDesc("$createdAt")]
  );
}

export async function updateStock(stockId, updates) {
  return databases.updateDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_STOCK_ID,
    String(stockId),
    updates
  );
}

export async function deleteStock(stockId) {
  return databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_STOCK_ID,
    String(stockId)
  );
}

/* --------------------- REPORTS --------------------- */
export async function addReport(report) {
  return databases.createDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_REPORTS_ID,
    "unique()",
    report
  );
}

export async function getReports() {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_REPORTS_ID,
    [Query.orderDesc("$createdAt")]
  );
}

export async function updateReport(reportId, updates) {
  return databases.updateDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_REPORTS_ID,
    String(reportId),
    updates
  );
}

export async function deleteReport(reportId) {
  return databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_REPORTS_ID,
    String(reportId)
  );
}
