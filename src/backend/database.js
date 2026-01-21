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

export async function getProductByName(name) {
  const res = await databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_TABLE_ID,
    [Query.equal("name", String(name))]
  );

  if (!res.total) return null;
  return res.documents[0];
}

export async function getProducts() {
  // Fetch all products - Appwrite default limit is 25, so we need to fetch all
  // Using a high limit to get all products at once
  try {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_TABLE_ID,
      [Query.limit(1000)] // Fetch up to 1000 products
    );
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback: try without limit if limit fails
    return databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_TABLE_ID
    );
  }
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
  email, // optional but helpful for admin view
}) {
  if (!userId || !items || !total || !name || !phone || !address || !city || !postalCode) {
    throw new Error("Missing required order fields");
  }

  const payload = {
    userId: String(userId),
    ...(email ? { email: String(email) } : {}),
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

export async function getOrdersByUser(userId) {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_ORDERS_ID,
    [Query.equal("userId", String(userId)), Query.orderDesc("$createdAt")]
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
  const stockId = import.meta.env.VITE_APPWRITE_STOCK_ID;
  if (!stockId) {
    throw new Error("VITE_APPWRITE_STOCK_ID is not configured. Please set it in your environment variables.");
  }
  return databases.createDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    stockId,
    "unique()",
    stock
  );
}

export async function getStocks() {
  const stockId = import.meta.env.VITE_APPWRITE_STOCK_ID;
  if (!stockId) {
    console.warn("VITE_APPWRITE_STOCK_ID is not configured. Returning empty stocks list.");
    return { documents: [], total: 0 };
  }
  try {
    return await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      stockId,
      [Query.orderDesc("$createdAt")]
    );
  } catch (error) {
    // If collection doesn't exist or other error, return empty list instead of crashing
    console.error("Error fetching stocks:", error);
    return { documents: [], total: 0 };
  }
}

export async function updateStock(stockId, updates) {
  const stockCollectionId = import.meta.env.VITE_APPWRITE_STOCK_ID;
  if (!stockCollectionId) {
    throw new Error("VITE_APPWRITE_STOCK_ID is not configured.");
  }
  return databases.updateDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    stockCollectionId,
    String(stockId),
    updates
  );
}

export async function deleteStock(stockId) {
  const stockCollectionId = import.meta.env.VITE_APPWRITE_STOCK_ID;
  if (!stockCollectionId) {
    throw new Error("VITE_APPWRITE_STOCK_ID is not configured.");
  }
  return databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    stockCollectionId,
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

/* --------------------- LAB TESTS --------------------- */
export async function addLabBooking(booking) {
  return databases.createDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_LAB_ID,
    "unique()",
    booking
  );
}

export async function getLabBookings(userId) {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_LAB_ID,
    [Query.equal("userId", String(userId)), Query.orderDesc("$createdAt")]
  );
}

export async function getAllLabBookings() {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_LAB_ID,
    [Query.orderDesc("$createdAt")]
  );
}

/* --------------------- PRESCRIPTIONS --------------------- */
export async function addPrescription(data) {
  return databases.createDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_PRESCRIPTION_ID,
    "unique()",
    data
  );
}

export async function getPrescriptions(userId) {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_PRESCRIPTION_ID,
    [Query.equal("userId", String(userId)), Query.orderDesc("$createdAt")]
  );
}

export async function getAllPrescriptions() {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_PRESCRIPTION_ID,
    [Query.orderDesc("$createdAt")]
  );
}

export async function updatePrescription(id, updates) {
  updates.$updatedAt = new Date().toISOString();
  return databases.updateDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_PRESCRIPTION_ID,
    String(id),
    updates
  );
}

export async function deletePrescription(id) {
  return databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_PRESCRIPTION_ID,
    String(id)
  );
}

export async function updateLabBooking(id, updates) {
  return databases.updateDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_LAB_ID,
    String(id),
    updates
  );
}

export async function deleteLabBooking(id) {
  return databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_LAB_ID,
    String(id)
  );
}

/* --------------------- REVIEWS --------------------- */
export async function addReview(review) {
  if (!import.meta.env.VITE_APPWRITE_REVIEWS_ID) {
    throw new Error("Missing VITE_APPWRITE_REVIEWS_ID in environment variables");
  }
  return databases.createDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_REVIEWS_ID,
    "unique()",
    review
  );
}

export async function getReviews(productId) {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_REVIEWS_ID,
    [Query.equal("productId", String(productId)), Query.orderDesc("$createdAt")]
  );
}

export async function getAllReviews() {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_REVIEWS_ID,
    [Query.orderDesc("$createdAt"), Query.limit(100)]
  );
}

export async function updateReview(reviewId, updates) {
  return databases.updateDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_REVIEWS_ID,
    String(reviewId),
    updates
  );
}

export async function deleteReview(reviewId) {
  return databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_REVIEWS_ID,
    String(reviewId)
  );
}
/* --------------------- NOTIFICATIONS --------------------- */
export async function addNotification(notification) {
  // notification = { userId, message, type, link, read: false }
  const notifId = import.meta.env.VITE_APPWRITE_NOTIFICATIONS_ID || "notifications";
  return databases.createDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    notifId,
    "unique()",
    notification
  );
}

export async function getNotifications(userId) {
  const notifId = import.meta.env.VITE_APPWRITE_NOTIFICATIONS_ID || "notifications";
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    notifId,
    [
      Query.equal("userId", String(userId)),
      Query.orderDesc("$createdAt"),
      Query.limit(20)
    ]
  );
}

export async function markNotificationRead(notificationId) {
  const notifId = import.meta.env.VITE_APPWRITE_NOTIFICATIONS_ID || "notifications";
  return databases.updateDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    notifId,
    String(notificationId),
    { read: true }
  );
}
