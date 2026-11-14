import React from 'react';
import { Package } from 'lucide-react';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products, onAdd, loading }) {
  if (loading) {
    return (
      <div className="loading-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div className="skeleton" key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="empty-state">
        <Package size={28} />
        <h3>No products found</h3>
        <p>Try another search or category.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} onAdd={onAdd} />
      ))}
    </div>
  );
}