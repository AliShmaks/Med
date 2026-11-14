import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductGrid } from '../components/ProductGrid';

export function ProductsPage({ store, cart }) {
  const [search, setSearch] = useState(
    new URLSearchParams(window.location.search).get('search') || ''
  );
  const [category, setCategory] = useState(
    new URLSearchParams(window.location.search).get('category') || 'All'
  );

  const filtered = store.products.filter(
    (p) =>
      (category === 'All' || p.category === category || p.category_id === category) &&
      `${p.name} ${p.description || ''}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <main className="inner-page section-pad">
      <div className="page-intro">
        <span className="eyebrow">THE UNI MED CATALOGUE</span>
        <h1>All equipment.</h1>
        <p>Explore our medical and dental equipment selection.</p>
      </div>

      <div className="catalog-toolbar">
        <div className="catalog-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
          />
        </div>
        <div className="select-wrap">
          <SlidersHorizontal size={16} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All</option>
            {store.categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="results-label">{filtered.length} products</div>

      <ProductGrid products={filtered} onAdd={cart.add} loading={store.loading} />
    </main>
  );
}