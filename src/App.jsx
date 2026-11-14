import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { useStoreData } from './hooks/useStoreData';
import { useCart } from './hooks/useCart';
import { smoothScrollTo, cancelScroll } from './utils/smoothScroll';
import { whatsappUrl } from './utils/whatsapp';

import { Header } from './components/Header';
import { ScrollProgress } from './components/ScrollProgress';
import { CartToast } from './components/CartToast';

import { Home } from './pages/Home';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/CartPage';
import { ContactPage } from './pages/ContactPage';
import { AdminGate } from './pages/admin/AdminGate';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const store = useStoreData();
  const baseCart = useCart();
  const location = useLocation();
  const [toast, setToast] = useState(null);

  const cart = useMemo(
    () => ({
      ...baseCart,
      add: (product) => {
        baseCart.add(product);
        setToast({ id: Date.now(), name: product.name });
      },
    }),
    [baseCart.items]
  );

  const hideToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    cancelScroll();
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (location.hash) {
      const t = setTimeout(() => smoothScrollTo(location.hash.slice(1)), 400);
      return () => clearTimeout(t);
    }
  }, [location.pathname, location.hash]);

  if (!isSupabaseConfigured && location.pathname.startsWith('/admin')) {
    return (
      <div className="setup-screen">
        <div className="setup-card">
          <div className="wordmark">
            UNI<span>MED</span><i>.</i>
          </div>
          <h1>Connect your Supabase project.</h1>
          <p>
            Add your Supabase URL and anon/publishable key to the <code>.env</code>{' '}
            file, then restart the development server to enable admin login.
          </p>
          <Link to="/" className="primary-button">
            Back to website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollProgress />
      <CartToast toast={toast} onDone={hideToast} />
      <Header categories={store.categories} cartCount={cart.count} />

      <Routes>
        <Route path="/" element={<Home store={store} cart={cart} />} />
        <Route path="/products" element={<ProductsPage store={store} cart={cart} />} />
        <Route path="/product/:id" element={<ProductDetail store={store} cart={cart} />} />
        <Route path="/cart" element={<CartPage cart={cart} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/admin/*"
          element={<AdminGate storeRefresh={store.refresh} />}
        />
        <Route
          path="*"
          element={
            <main className="inner-page section-pad">
              <h1>Page not found.</h1>
              <Link to="/" className="text-cta">
                Return home <ArrowRight size={16} />
              </Link>
            </main>
          }
        />
      </Routes>

      <footer className="site-footer">
        <div className="footer-main">
          <Link to="/" className="wordmark">
            UNI<span>MED</span><i>.</i>
          </Link>
          <p>
            Equipping care.
            <br />
            Supporting people.
          </p>
          <a
            href={whatsappUrl('Hello UNI MED, I would like to get in touch.')}
            target="_blank"
            rel="noreferrer"
            className="footer-contact"
          >
            Talk to our team <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} UNI MED. All rights reserved.</span>
          <span>YOUR PARTNER IN HEALTHCARE</span>
          <Link to="/admin">Admin login</Link>
        </div>
      </footer>
    </>
  );
}