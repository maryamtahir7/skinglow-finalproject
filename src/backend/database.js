// db-proxy client for SkinGlow

async function dbCall(action, payload = {}) {
  const res = await fetch('/api/db-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload })
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`DB Error [${action}]:`, errorText);
    throw new Error(errorText);
  }
  return res.json();
}

/* --------------------- DASHBOARD & USERS --------------------- */
export async function getDashboardStats() {
  return dbCall('getDashboardStats');
}

export async function getUsers() {
  return dbCall('getUsers');
}

export async function deleteUser(userId) {
  return dbCall('deleteUser', { userId });
}

/* --------------------- PRODUCTS --------------------- */
export async function addProduct(product) {
  return dbCall('addProduct', product);
}

export async function getProductByName(name) {
  // Can just fetch all and filter, or create a specific action if needed
  const res = await getProducts();
  const found = res.documents.find(p => p.name === name);
  return found || null;
}

export async function getProducts() {
  return dbCall('getProducts');
}

export async function getProductById(productId) {
  return dbCall('getProductById', { id: productId });
}

export async function updateProduct(productId, updates) {
  return dbCall('updateProduct', { id: productId, updates });
}

export async function deleteProduct(productId) {
  return dbCall('deleteProduct', { id: productId });
}

/* --------------------- CATEGORIES --------------------- */
export async function addCategory(category) {
  return dbCall('addCategory', category);
}

export async function getCategories() {
  return dbCall('getCategories');
}

export async function getCategoryById(categoryId) {
  const res = await getCategories();
  return res.documents.find(c => c.id === categoryId) || null;
}

export async function updateCategory(categoryId, updates) {
  return dbCall('updateCategory', { id: categoryId, updates });
}

export async function deleteCategory(categoryId) {
  return dbCall('deleteCategory', { id: categoryId });
}

/* --------------------- HELPERS --------------------- */
export async function getProductsByIds(ids = []) {
  if (!Array.isArray(ids) || !ids.length) return { documents: [] };
  return dbCall('getProductsByIds', { ids });
}

/* --------------------- CART --------------------- */
export async function getCart(userId) {
  return dbCall('getCart', { userId });
}

export async function addToCart({ userId, productId, quantity = 1 }) {
  return dbCall('addToCart', { userId, productId, quantity });
}

export async function setCartItemQuantity(cartItemId, quantity) {
  return dbCall('setCartItemQuantity', { cartItemId, quantity });
}

export async function removeFromCart(cartItemId) {
  return dbCall('removeFromCart', { cartItemId });
}

export async function clearCart(userId) {
  return dbCall('clearCart', { userId });
}

/* --------------------- WISHLIST --------------------- */
export async function getWishlist(userId) {
  return dbCall('getWishlist', { userId });
}

export async function addToWishlist({ userId, productId }) {
  return dbCall('addToWishlist', { userId, productId });
}

export async function removeFromWishlist(wishlistItemId) {
  return dbCall('removeFromWishlist', { wishlistItemId });
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
  email,
}) {
  return dbCall('createOrder', {
    userId,
    items,
    total,
    name,
    phone,
    address,
    city,
    postalCode,
    notes,
    paymentMethod,
    status,
    email
  });
}

export async function getOrders() {
  return dbCall('getOrders');
}

export async function getOrdersByUser(userId) {
  return dbCall('getOrdersByUser', { userId });
}

export async function updateOrder(orderId, updates) {
  return dbCall('updateOrder', { orderId, updates });
}

export async function deleteOrder(orderId) {
  return dbCall('deleteOrder', { orderId });
}

/* --------------------- STOCK --------------------- */
export async function addStock(stock) { return dbCall('addStock', stock); }
export async function getStocks() { return dbCall('getStocks'); }
export async function updateStock(stockId, updates) { return dbCall('updateStock', { stockId, updates }); }
export async function deleteStock(stockId) { return dbCall('deleteStock', { stockId }); }

/* --------------------- REPORTS --------------------- */
export async function addReport(report) { return dbCall('addReport', report); }
export async function getReports() { return dbCall('getReports'); }
export async function updateReport(reportId, updates) { return dbCall('updateReport', { reportId, updates }); }
export async function deleteReport(reportId) { return dbCall('deleteReport', { reportId }); }

/* --------------------- LAB TESTS --------------------- */
export async function addLabBooking(booking) { return dbCall('addLabBooking', booking); }
export async function getLabBookings(userId) { return dbCall('getLabBookings', { userId }); }
export async function getAllLabBookings() { return dbCall('getAllLabBookings'); }
export async function updateLabBooking(id, updates) { return dbCall('updateLabBooking', { id, updates }); }
export async function deleteLabBooking(id) { return dbCall('deleteLabBooking', { id }); }

/* --------------------- PRESCRIPTIONS --------------------- */
export async function addPrescription(data) { return dbCall('addPrescription', data); }
export async function getPrescriptions(userId) { return dbCall('getPrescriptions', { userId }); }
export async function getAllPrescriptions() { return dbCall('getAllPrescriptions'); }
export async function updatePrescription(id, updates) { return dbCall('updatePrescription', { id, updates }); }
export async function deletePrescription(id) { return dbCall('deletePrescription', { id }); }

/* --------------------- REVIEWS --------------------- */
export async function canUserReviewProduct(userId, productId) {
  try {
    const orders = await getOrdersByUser(userId);
    for (const order of orders.documents) {
      if (order.status !== 'delivered') continue;
      const found = order.items.find(item => item.productId === productId);
      if (found) return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    return false;
  }
}

export async function addReview(review) {
  return dbCall('addReview', review);
}

export async function getReviews(productId) {
  return dbCall('getReviews', { productId });
}

export async function getAllReviews() {
  return dbCall('getAllReviews');
}

export async function updateReview(reviewId, updates) {
  return dbCall('updateReview', { reviewId, updates });
}

export async function deleteReview(reviewId) {
  return dbCall('deleteReview', { reviewId });
}

/* --------------------- NOTIFICATIONS --------------------- */
export async function addNotification(notification) { return dbCall('addNotification', notification); }
export async function getNotifications(userId) { return dbCall('getNotifications', { userId }); }
export async function markNotificationRead(notificationId) { return dbCall('markNotificationRead', { notificationId }); }
export async function deleteNotification(notificationId) { return dbCall('deleteNotification', { notificationId }); }
