import { ShoppingBag, Check, X, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductConfirmCard({ product, onConfirm, onCancel, confirmed, loading }) {
  const image = product?.imageUrl || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400';

  return (
    <div className={`ai-confirm-card ${confirmed === true ? 'ai-confirm-card--success' : confirmed === false ? 'ai-confirm-card--cancelled' : ''}`}>
      <div className="ai-confirm-card__shine" />
      <div className="ai-confirm-card__badge">
        <ShoppingBag className="w-3.5 h-3.5" />
        Add to Cart
      </div>

      <div className="ai-confirm-card__body">
        <div className="ai-confirm-card__image-wrap">
          <img src={image} alt={product?.name} className="ai-confirm-card__image" />
          <div className="ai-confirm-card__glow" />
        </div>

        <div className="ai-confirm-card__info">
          <p className="ai-confirm-card__category">{product?.category || 'Skincare'}</p>
          <h4 className="ai-confirm-card__title">{product?.name}</h4>
          {product?.benefits?.length > 0 && (
            <p className="ai-confirm-card__benefit">{product.benefits[0]}</p>
          )}
          <p className="ai-confirm-card__price">Rs. {Number(product?.price || 0).toLocaleString()}</p>
          {!product?.inStock && (
            <span className="ai-confirm-card__stock">Out of stock</span>
          )}
        </div>
      </div>

      {confirmed === null && (
        <>
          <p className="ai-confirm-card__question">
            <Sparkles className="w-4 h-4 inline mr-1" />
            Is this the product you want to add?
          </p>
          <div className="ai-confirm-card__actions">
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading || !product?.inStock}
              className="ai-confirm-btn ai-confirm-btn--yes"
            >
              <Check className="w-4 h-4" />
              {loading ? 'Adding...' : 'Yes, Add to Cart'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="ai-confirm-btn ai-confirm-btn--no"
            >
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
            Added to your cart!
          </p>
          <Link to="/cart" className="ai-view-cart-btn">
            View Cart <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
      {confirmed === false && (
        <p className="ai-confirm-card__status ai-confirm-card__status--cancel">Cancelled</p>
      )}
    </div>
  );
}
