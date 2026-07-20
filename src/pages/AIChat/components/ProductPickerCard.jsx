import { Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductPickerCard({ products, hint, onSelect, loading, mode = 'order' }) {
  if (!products?.length) return null;

  const isBrowse = mode === 'browse';

  return (
    <div className="ai-product-picker">
      <div className="ai-product-picker__header">
        <Sparkles className="w-4 h-4 text-pink-500" />
        <span>{hint || (isBrowse ? 'Tap a product to view' : 'Choose a product to order')}</span>
      </div>
      <div className="ai-product-picker__grid">
        {products.map((product) => {
          const content = (
            <>
              <img
                src={product.imageUrl || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=200'}
                alt={product.name}
                className="ai-product-picker__img"
              />
              <div className="ai-product-picker__info">
                <p className="ai-product-picker__name">{product.name}</p>
                <p className="ai-product-picker__price">
                  Rs. {Number(product.price || 0).toLocaleString()}
                </p>
                {isBrowse && (
                  <span className="ai-product-picker__link">
                    View product <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>
            </>
          );

          if (isBrowse) {
            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="ai-product-picker__item ai-product-picker__item--link"
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={product.id}
              type="button"
              disabled={loading || !product.inStock}
              onClick={() => onSelect(product)}
              className="ai-product-picker__item"
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
