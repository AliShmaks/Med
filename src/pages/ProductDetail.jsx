import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react';
import { formatPrice } from '../lib/supabase';
import { fallbackProducts } from '../data/fallback';
import { whatsappUrl } from '../utils/whatsapp';

export function ProductDetail({ store, cart }) {
  const { id } = useParams();
  const product =
    store.products.find((p) => String(p.id) === id) ||
    fallbackProducts.find((p) => p.id === id);

  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="inner-page section-pad">
        <div className="empty-state">
          <Package />
          <h2>Product not found</h2>
          <Link to="/products" className="text-cta">
            Back to products <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  const images = product.image_urls?.length ? product.image_urls : [];
  const specs =
    product.specifications && typeof product.specifications === 'object'
      ? Object.entries(product.specifications)
      : [];

  const add = () => {
    for (let i = 0; i < quantity; i++) cart.add(product);
  };

  return (
    <main className="detail-page section-pad">
      <Link to="/products" className="back-link">
        <ArrowLeft size={16} /> All products
      </Link>

      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="detail-main-image">
            {images[active] ? (
              <img src={images[active]} alt={product.name} />
            ) : (
              <div className="image-placeholder">
                <Package size={44} />
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  className="gallery-arrow prev"
                  onClick={() =>
                    setActive((active - 1 + images.length) % images.length)
                  }
                >
                  <ChevronLeft />
                </button>
                <button
                  className="gallery-arrow next"
                  onClick={() => setActive((active + 1) % images.length)}
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="thumbnail-row">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  className={active === i ? 'active' : ''}
                  onClick={() => setActive(i)}
                >
                  <img src={src} alt={`${product.name} view ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <span className="eyebrow">{product.category || 'UNI MED EQUIPMENT'}</span>
          <h1>{product.name}</h1>
          <div className="detail-price">{formatPrice(product.price)}</div>
          <p className="detail-description">
            {product.description ||
              'Contact UNI MED for more information about this product, availability and technical support.'}
          </p>

          {specs.length > 0 && (
            <div className="spec-list">
              <h3>Product information</h3>
              {specs.map(([k, v]) => (
                <div key={k}>
                  <span>{k}</span>
                  <strong>{String(v)}</strong>
                </div>
              ))}
            </div>
          )}

          <div className="purchase-row">
            <div className="quantity-control">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                <Minus size={15} />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>
                <Plus size={15} />
              </button>
            </div>
            <button className="primary-button" onClick={add}>
              Add to cart <ShoppingCart size={17} />
            </button>
          </div>

          <a
            className="whatsapp-inline"
            href={whatsappUrl(`Hello UNI MED, I'm interested in ${product.name}.`)}
            target="_blank"
            rel="noreferrer"
          >
            Ask about this product on WhatsApp <ArrowUpRight size={15} />
          </a>

          <div className="detail-assurance">
            <ShieldCheck size={18} />
            <span>Local support from the UNI MED team</span>
          </div>
        </div>
      </div>
    </main>
  );
}