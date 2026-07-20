import prisma from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { action, payload } = req.body;

        switch (action) {
            // AUTH
            case 'signup': {
                const existing = await prisma.user.findUnique({ where: { email: payload.email } });
                if (existing) return res.status(400).json({ error: 'Email already in use' });
                
                const role = payload.email === 'skin.glow.skincare.pk@gmail.com' ? 'ADMIN' : 'CUSTOMER';
                const user = await prisma.user.create({ data: { email: payload.email, password: payload.password, name: payload.name, role } });
                return res.status(200).json(user);
            }
            case 'login': {
                let user = await prisma.user.findUnique({ where: { email: payload.email } });
                if (!user || user.password !== payload.password) return res.status(401).json({ error: 'Invalid credentials' });
                
                // Auto upgrade to admin if it's the admin email
                if (user.email === 'skin.glow.skincare.pk@gmail.com' && user.role !== 'ADMIN') {
                    user = await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } });
                }
                
                return res.status(200).json(user);
            }

            // PRODUCTS
            case 'getProducts': {
                const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
                const mapped = products.map(p => ({ ...p, $id: p.id }));
                return res.status(200).json({ documents: mapped, total: mapped.length });
            }
            case 'getProductById': {
                const product = await prisma.product.findUnique({ where: { id: payload.id } });
                if (product) product.$id = product.id;
                return res.status(200).json(product);
            }
            case 'getProductsByIds': {
                const products = await prisma.product.findMany({ where: { id: { in: payload.ids } } });
                const mapped = products.map(p => ({ ...p, $id: p.id }));
                return res.status(200).json({ documents: mapped, total: mapped.length });
            }
            case 'addProduct': {
                const p = await prisma.product.create({ data: payload });
                return res.status(200).json(p);
            }
            case 'updateProduct': {
                const p = await prisma.product.update({ where: { id: payload.id }, data: payload.updates });
                return res.status(200).json(p);
            }
            case 'deleteProduct': {
                await prisma.product.delete({ where: { id: payload.id } });
                return res.status(200).json({ success: true });
            }

            // ORDERS
            case 'getOrders': {
                const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, include: { items: true } });
                const mapped = orders.map(o => ({ ...o, $id: o.id }));
                return res.status(200).json({ documents: mapped, total: mapped.length });
            }
            case 'getOrdersByUser': {
                const orders = await prisma.order.findMany({ where: { userId: payload.userId }, orderBy: { createdAt: 'desc' }, include: { items: true } });
                const mapped = orders.map(o => ({ ...o, $id: o.id }));
                return res.status(200).json({ documents: mapped, total: mapped.length });
            }
            case 'createOrder': {
                const order = await prisma.order.create({
                    data: {
                        userId: payload.userId,
                        total: payload.total,
                        status: payload.status || 'PENDING',
                        name: payload.name,
                        phone: payload.phone,
                        address: payload.address,
                        city: payload.city,
                        postalCode: payload.postalCode,
                        notes: payload.notes,
                        paymentMethod: payload.paymentMethod,
                        items: {
                            create: payload.items.map(item => ({
                                productId: item.productId || item.id,
                                quantity: item.quantity,
                                price: item.price
                            }))
                        }
                    }
                });
                return res.status(200).json(order);
            }
            case 'updateOrder': {
                if (payload.updates?.status) {
                    payload.updates.status = payload.updates.status.toUpperCase();
                }
                const order = await prisma.order.update({
                    where: { id: payload.orderId },
                    data: payload.updates
                });
                return res.status(200).json(order);
            }
            case 'deleteOrder': {
                await prisma.order.delete({ where: { id: payload.orderId } });
                return res.status(200).json({ success: true });
            }

            // CART
            case 'getCart': {
                const cart = await prisma.cartItem.findMany({ where: { userId: payload.userId }, include: { product: true }, orderBy: { createdAt: 'desc' } });
                // map to appwrite format
                const mapped = cart.map(c => ({ $id: c.id, ...c, product: c.product }));
                return res.status(200).json({ documents: mapped, total: mapped.length });
            }
            case 'addToCart': {
                const existing = await prisma.cartItem.findFirst({
                    where: { userId: payload.userId, productId: payload.productId }
                });
                if (existing) {
                    const updated = await prisma.cartItem.update({
                        where: { id: existing.id },
                        data: { quantity: existing.quantity + (payload.quantity || 1) }
                    });
                    return res.status(200).json(updated);
                }
                const created = await prisma.cartItem.create({
                    data: { userId: payload.userId, productId: payload.productId, quantity: payload.quantity || 1 }
                });
                return res.status(200).json(created);
            }
            case 'removeFromCart': {
                await prisma.cartItem.delete({ where: { id: payload.cartItemId } });
                return res.status(200).json({ success: true });
            }
            case 'setCartItemQuantity': {
                const updated = await prisma.cartItem.update({
                    where: { id: payload.cartItemId },
                    data: { quantity: payload.quantity }
                });
                return res.status(200).json(updated);
            }
            case 'clearCart': {
                await prisma.cartItem.deleteMany({ where: { userId: payload.userId } });
                return res.status(200).json({ success: true });
            }

            // WISHLIST
            case 'getWishlist': {
                const wishlist = await prisma.wishlistItem.findMany({ where: { userId: payload.userId }, include: { product: true }, orderBy: { createdAt: 'desc' } });
                const mapped = wishlist.map(w => ({ $id: w.id, ...w }));
                return res.status(200).json({ documents: mapped, total: mapped.length });
            }
            case 'addToWishlist': {
                const existing = await prisma.wishlistItem.findFirst({
                    where: { userId: payload.userId, productId: payload.productId }
                });
                if (existing) return res.status(200).json(existing);
                const created = await prisma.wishlistItem.create({
                    data: { userId: payload.userId, productId: payload.productId }
                });
                return res.status(200).json(created);
            }
            case 'removeFromWishlist': {
                await prisma.wishlistItem.delete({ where: { id: payload.wishlistItemId } });
                return res.status(200).json({ success: true });
            }

            // REVIEWS
            case 'getReviews': {
                const reviews = await prisma.review.findMany({ where: { productId: payload.productId }, include: { user: true }, orderBy: { createdAt: 'desc' } });
                const mapped = reviews.map(r => ({ ...r, $id: r.id, $createdAt: r.createdAt, review: r.comment, userid: r.userId, username: r.user?.name || r.user?.email || 'Verified Buyer' }));
                return res.status(200).json({ documents: mapped, total: mapped.length });
            }
            case 'addReview': {
                const created = await prisma.review.create({
                    data: { 
                        userId: payload.userId || payload.userid, 
                        productId: payload.productId, 
                        rating: payload.rating, 
                        comment: payload.comment || payload.review 
                    }
                });
                return res.status(200).json(created);
            }
            case 'updateReview': {
                const updateData = {};
                if (payload.updates?.review !== undefined) updateData.comment = payload.updates.review;
                if (payload.updates?.rating !== undefined) updateData.rating = payload.updates.rating;
                const updated = await prisma.review.update({
                    where: { id: payload.reviewId },
                    data: updateData
                });
                return res.status(200).json({ ...updated, $id: updated.id, review: updated.comment });
            }
            case 'deleteReview': {
                await prisma.review.delete({ where: { id: payload.reviewId } });
                return res.status(200).json({ success: true });
            }
            case 'getAllReviews': {
                const allReviews = await prisma.review.findMany({ include: { user: true, product: true }, orderBy: { createdAt: 'desc' } });
                const mapped = allReviews.map(r => ({ ...r, $id: r.id, $createdAt: r.createdAt, review: r.comment, userid: r.userId, username: r.user?.name || r.user?.email || 'Verified Buyer', productName: r.product?.name }));
                return res.status(200).json({ documents: mapped, total: mapped.length });
            }
            // CATEGORIES
            case 'getCategories': {
                const categories = await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
                const mapped = categories.map(c => ({ ...c, $id: c.id, imageUrl: c.image }));
                return res.status(200).json({ documents: mapped, total: mapped.length });
            }
            case 'addCategory': {
                if (payload.imageUrl !== undefined) {
                    payload.image = payload.imageUrl;
                    delete payload.imageUrl;
                }
                const c = await prisma.category.create({ data: payload });
                return res.status(200).json(c);
            }
            case 'updateCategory': {
                if (payload.updates?.imageUrl !== undefined) {
                    payload.updates.image = payload.updates.imageUrl;
                    delete payload.updates.imageUrl;
                }
                const c = await prisma.category.update({ where: { id: payload.id }, data: payload.updates });
                return res.status(200).json(c);
            }
            case 'deleteCategory': {
                await prisma.category.delete({ where: { id: payload.id } });
                return res.status(200).json({ success: true });
            }

            // REPORTS
            case 'getReports': {
                const reports = await prisma.report.findMany({ orderBy: { createdAt: 'desc' } });
                const mapped = reports.map(r => ({ ...r, $id: r.id }));
                return res.status(200).json({ documents: mapped, total: mapped.length });
            }
            case 'addReport': {
                const created = await prisma.report.create({ data: payload });
                return res.status(200).json(created);
            }
            case 'updateReport': {
                const updated = await prisma.report.update({ where: { id: payload.reportId }, data: payload.updates });
                return res.status(200).json(updated);
            }
            case 'deleteReport': {
                await prisma.report.delete({ where: { id: payload.reportId } });
                return res.status(200).json({ success: true });
            }

            // STOCKS
            case 'getStocks': {
                const stocks = await prisma.stock.findMany({ orderBy: { createdAt: 'desc' }, include: { product: true } });
                const mapped = stocks.map(s => ({ ...s, $id: s.id }));
                return res.status(200).json({ documents: mapped, total: mapped.length });
            }
            case 'addStock': {
                const created = await prisma.stock.create({ data: payload });
                return res.status(200).json(created);
            }
            case 'updateStock': {
                const updated = await prisma.stock.update({ where: { id: payload.stockId }, data: payload.updates });
                return res.status(200).json(updated);
            }
            case 'deleteStock': {
                await prisma.stock.delete({ where: { id: payload.stockId } });
                return res.status(200).json({ success: true });
            }

            // NOTIFICATIONS
            case 'getNotifications': {
                const notifs = await prisma.notification.findMany({ where: { userId: payload.userId }, orderBy: { createdAt: 'desc' } });
                const mapped = notifs.map(n => ({ ...n, $id: n.id }));
                return res.status(200).json({ documents: mapped, total: mapped.length });
            }
            case 'addNotification': {
                const created = await prisma.notification.create({ data: payload });
                return res.status(200).json(created);
            }
            case 'markNotificationRead': {
                const updated = await prisma.notification.update({
                    where: { id: payload.notificationId },
                    data: { read: true }
                });
                return res.status(200).json(updated);
            }
            case 'deleteNotification': {
                await prisma.notification.delete({ where: { id: payload.notificationId } });
                return res.status(200).json({ success: true });
            }

            // Mocks for others to prevent crashing
            case 'getLabBookings':
            case 'getAllLabBookings':
            case 'getPrescriptions':
            case 'getAllPrescriptions':
                return res.status(200).json({ documents: [], total: 0 });

            default:
                console.warn(`Action ${action} not implemented in db-proxy`);
                return res.status(400).json({ message: `Action ${action} not implemented` });
        }
    } catch (error) {
        console.error('DB Proxy Error:', error);
        res.status(500).json({ message: 'Database error', error: error.message });
    }
}
