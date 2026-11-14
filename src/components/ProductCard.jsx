import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../lib/supabase';

const ease = [0.22, 1, 0.36, 1];

export function ProductCard({ product, onAdd, index = 0 }) {
  const [imageIndex] = useState(0);
  const images = product.image_urls?.length ? product.image_urls : [];

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 46 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.85, ease, delay: (index % 4) * 0.09 }}
    >
      <Link to={`/product/${product.id}`} className="product-image-wrap">
        {images[imageIndex] ? (
          <img src={images[imageIndex]} alt={product.name} loading="lazy" />
        ) : (
          <div className="image-placeholder">
            <Package size={30} />
          </div>
        )}
        {images.length > 1 && (
          <div className="image-dots">
            {images.map((_, i) => (
              <span key={i} className={i === imageIndex ? 'active' : ''} />
            ))}
          </div>
        )}
      </Link>
      <div className="product-meta">
        <div className="product-copy">
          <Link to={`/product/${product.id}`} className="product-name">
            {product.name}
          </Link>
          <span className="product-price">{formatPrice(product.price)}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.82 }}
          className="add-icon"
          aria-label={`Add ${product.name} to cart`}
          onClick={() => onAdd(product)}
        >
          <ShoppingCart size={16} />
        </motion.button>
      </div>
    </motion.article>
  );
}