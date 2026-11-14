import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { formatPrice } from '../lib/supabase';
import { whatsappUrl } from '../utils/whatsapp';

export function CartPage({ cart }) {
  const [sent, setSent] = useState(false);

  const message = useMemo(
    () =>
      `Hello UNI MED, I would like to place an order:\n\n${cart.items
        .map(
          (i) =>
            `• ${i.name} × ${i.quantity}${
              i.price != null
                ? ` — ${formatPrice(Number(i.price) * i.quantity)}`
                : ''
            }`
        )
        .join('\n')}\n\nTotal: ${formatPrice(
        cart.total
      )}\n\nPlease contact me to confirm availability and delivery.`,
    [cart.items, cart.total]
  );

  if (!cart.items.length) {
    return (
      <main className="inner-page section-pad">
        <div className="page-intro">
          <span className="eyebrow">YOUR SELECTION</span>
          <h1>Shopping cart.</h1>
        </div>
        <div className="empty-state cart-empty">
          <ShoppingBag size={34} />
          <h2>Your cart is empty.</h2>
          <p>Explore the catalogue and add the equipment you need.</p>
          <Link to="/products" className="primary-button">
            Explore products <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="inner-page section-pad">
      <div className="page-intro">
        <span className="eyebrow">YOUR SELECTION</span>
        <h1>Shopping cart.</h1>
        <p>Review your items before sending your order to UNI MED.</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-thumb">
                {item.image_urls?.[0] ? (
                  <img src={item.image_urls[0]} alt="" />
                ) : (
                  <Package />
                )}
              </div>
              <div className="cart-item-info">
                <Link to={`/product/${item.id}`}>{item.name}</Link>
                <span>{formatPrice(item.price)}</span>
                <div className="quantity-control small">
                  <button onClick={() => cart.change(item.id, -1)}>
                    <Minus size={13} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => cart.change(item.id, 1)}>
                    <Plus size={13} />
                  </button>
                </div>
              </div>
              <button
                className="remove-item"
                onClick={() => cart.remove(item.id)}
                aria-label="Remove item"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>

        <aside className="order-summary">
          <span className="eyebrow">ORDER SUMMARY</span>
          <div className="summary-line">
            <span>Items ({cart.count})</span>
            <strong>{formatPrice(cart.total)}</strong>
          </div>
          <div className="summary-line total">
            <span>Estimated total</span>
            <strong>{formatPrice(cart.total)}</strong>
          </div>
          <p>
            Final availability, delivery and payment details will be confirmed by
            our team.
          </p>
          <a
            className="primary-button full"
            href={whatsappUrl(message)}
            target="_blank"
            rel="noreferrer"
            onClick={() => setSent(true)}
          >
            Continue on WhatsApp <ArrowUpRight size={17} />
          </a>
          <button className="clear-cart" onClick={cart.clear}>
            Clear cart
          </button>
        </aside>
      </div>
    </main>
  );
}