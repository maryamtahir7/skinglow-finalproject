import { ShoppingCart, Sparkles } from 'lucide-react';

export default function OrderSourceChoiceCard({
  choice,
  onChoose,
  loading,
}) {
  if (!choice) return null;

  const { hasCart, cartItemCount, cartTotal, cartPreview, skinTypes } = choice;

  return (
    <div className="ai-order-source">
      <div className="ai-order-source__header">
        <Sparkles className="w-4 h-4 text-pink-500" />
        <span>How would you like to order?</span>
      </div>

      {hasCart && (
        <button
          type="button"
          disabled={loading}
          onClick={() => onChoose('cart')}
          className="ai-order-source__cart-btn"
        >
          <div className="ai-order-source__cart-icon">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div className="ai-order-source__cart-info">
            <span className="ai-order-source__cart-title">
              Order from my cart ({cartItemCount} item{cartItemCount !== 1 ? 's' : ''})
            </span>
            {cartPreview?.length > 0 && (
              <span className="ai-order-source__cart-preview">
                {cartPreview.join(' · ')}
              </span>
            )}
            <span className="ai-order-source__cart-total">
              Total: Rs. {Number(cartTotal || 0).toLocaleString()}
            </span>
          </div>
        </button>
      )}

      <p className="ai-order-source__divider">
        {hasCart ? 'Or pick products for your skin type:' : 'Pick products for your skin type:'}
      </p>

      <div className="ai-order-source__skin-grid">
        {(skinTypes || []).map((skin) => (
          <button
            key={skin.id}
            type="button"
            disabled={loading}
            onClick={() => onChoose(skin.id)}
            className="ai-order-source__skin-btn"
          >
            <span className="ai-order-source__skin-emoji">{skin.emoji}</span>
            <span>{skin.label}</span>
          </button>
        ))}
      </div>

      {choice.showProductHint !== false && (
        <p className="ai-order-source__hint">
          Or type a product name — e.g. &quot;Hydra Balance Cleanser order krna hai&quot;
        </p>
      )}
    </div>
  );
}
