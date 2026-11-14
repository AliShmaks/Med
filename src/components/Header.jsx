import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import { ScrollLink } from './ScrollLink';
import { smoothScrollTo } from '../utils/smoothScroll';

export function Header({ categories, cartCount }) {
  const [open, setOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-shell">
          <Link
            to="/"
            className="wordmark"
            aria-label="UNI MED home"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                smoothScrollTo('top');
              }
            }}
          >
            UNI<span>MED</span><i>.</i>
          </Link>

          <nav className="desktop-nav">
            <Link to="/">Home</Link>
            <Link to="/products">All products</Link>
            <ScrollLink to="about">About</ScrollLink>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="nav-actions">
            <button
              className="icon-button search-trigger"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
            >
              <Search size={19} />
            </button>
            <Link
              to="/cart"
              className="cart-link"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag size={19} />
              <span>{cartCount}</span>
            </Link>
            <button
              className="icon-button menu-trigger"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="side-menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            >
              <div className="side-menu-top">
                <Link to="/" className="wordmark">
                  UNI<span>MED</span><i>.</i>
                </Link>
                <button className="icon-button" onClick={() => setOpen(false)}>
                  <X />
                </button>
              </div>
              <div className="menu-links">
                <Link to="/">Home <ArrowUpRight size={17} /></Link>
                <Link to="/products">All products <ArrowUpRight size={17} /></Link>
                <button
                  className="menu-category-toggle"
                  onClick={() => setCatsOpen((v) => !v)}
                >
                  Categories <ChevronDown className={catsOpen ? 'rotated' : ''} size={18} />
                </button>
                <AnimatePresence>
                  {catsOpen && (
                    <motion.div
                      className="menu-categories"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          to={`/products?category=${encodeURIComponent(c.name)}`}
                        >
                          {c.name}<ArrowUpRight size={14} />
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                <ScrollLink to="about" onClick={() => setOpen(false)}>
                  About UNI MED <ArrowUpRight size={17} />
                </ScrollLink>
                <Link to="/contact" onClick={() => setOpen(false)}>
                  Contact us <ArrowUpRight size={17} />
                </Link>
                <Link to="/cart">
                  Shopping cart <span className="menu-count">{cartCount}</span>
                </Link>
              </div>
              <div className="menu-footer">
                <span>YOUR PARTNER IN HEALTHCARE</span>
                <p>Equipping care.<br />Supporting people.</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="search-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Search size={18} />
            <input
              autoFocus
              placeholder="Search equipment..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  window.location.href = `/products?search=${encodeURIComponent(
                    e.currentTarget.value
                  )}`;
                }
              }}
            />
            <button className="icon-button" onClick={() => setSearchOpen(false)}>
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}