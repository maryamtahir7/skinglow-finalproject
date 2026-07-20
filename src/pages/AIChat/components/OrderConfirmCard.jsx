import { Package, Check, X, MapPin, Phone, CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrderConfirmCard({ order, onConfirm, onCancel, confirmed, loading, orderId }) {
  const { items = [], total = 0, shipping = {} } = order || {};

  return (
    <div className={`ai-confirm-card ai-order-card ${confirmed === true ? 'ai-confirm-card--success' : confirmed === false ? 'ai-confirm-card--cancelled' : ''}`}>
      <div className="ai-confirm-card__shine" />
      <div className="ai-confirm-card__badge ai-confirm-card__badge--order">
        <Package className="w-3.5 h-3.5" />
        Order Summary
      </div>

      <div className="ai-order-items">
        {items.map((item) => (
          <div key={item.productId} className="ai-order-item">
            <span className="ai-order-item__name">{item.name}</span>
            <span className="ai-order-item__qty">×{item.quantity || 1}</span>
            <span className="ai-order-item__price">Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="ai-order-shipping">
        {shipping.name && (
          <div className="ai-order-shipping__row">
            <span className="font-semibold text-slate-700">{shipping.name}</span>
          </div>
        )}
        <div className="ai-order-shipping__row">
          <Phone className="w-3.5 h-3.5 text-primary/70" />
          <span>{shipping.phone}</span>
        </div>
        <div className="ai-order-shipping__row">
          <MapPin className="w-3.5 h-3.5 text-primary/70" />
          <span>{shipping.address}, {shipping.city}</span>
        </div>
        <div className="ai-order-shipping__row">
          <CreditCard className="w-3.5 h-3.5 text-primary/70" />
          <span>Cash on Delivery (COD)</span>
        </div>
      </div>

      <div className="ai-order-total">
        <span>Total (incl. tax)</span>
        <strong>Rs. {Number(total).toLocaleString()}</strong>
      </div>

      {confirmed === null && (
        <>
          <p className="ai-confirm-card__question">Everything look correct? Confirm to place your order.</p>
          <div className="ai-confirm-card__actions">
            <button type="button" onClick={onConfirm} disabled={loading} className="ai-confirm-btn ai-confirm-btn--yes">
              <Check className="w-4 h-4" />
              {loading ? 'Placing...' : 'Yes, Place Order'}
            </button>
            <button type="button" onClick={onCancel} disabled={loading} className="ai-confirm-btn ai-confirm-btn--no">
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </>
      )}

      {confirmed === true && (
        <div className="ai-confirm-card__success-block">
          <p className="ai-confirm-card__status ai-confirm-card__status--success">
            <Check className="w-4 h-4 inline mr-1" />
            Order placed successfully!
          </p>
          {orderId && (
            <p className="text-center text-xs text-slate-500 font-semibold">Order ID: {orderId}</p>
          )}
          <Link to="/orders" className="ai-view-cart-btn">
            View My Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
      {confirmed === false && (
        <p className="ai-confirm-card__status ai-confirm-card__status--cancel">Order cancelled</p>
      )}
    </div>
  );
}
