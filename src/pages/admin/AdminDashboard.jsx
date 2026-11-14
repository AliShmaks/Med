import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Check,
  Package,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import { formatPrice, supabase } from '../../lib/supabase';

export function AdminDashboard({ session, onLogout, storeRefresh }) {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    specifications: '',
    is_active: true,
  });
  const [files, setFiles] = useState([]);

  const load = useCallback(async () => {
    const [p, c] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]);
    if (!p.error) setProducts(p.data || []);
    if (!c.error) setCategories(c.data || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reset = () => {
    setEditing(null);
    setFiles([]);
    setForm({
      name: '',
      price: '',
      category: categories[0]?.name || '',
      description: '',
      specifications: '',
      is_active: true,
    });
  };

  const startEdit = (p) => {
    setEditing(p);
    setFiles([]);
    setForm({
      name: p.name || '',
      price: p.price ?? '',
      category: p.category || categories.find((c) => c.id === p.category_id)?.name || '',
      description: p.description || '',
      specifications: JSON.stringify(p.specifications || {}, null, 2),
      is_active: p.is_active !== false,
    });
    setTab('products');
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      let imageUrls = editing?.image_urls || [];
      for (const file of files) {
        const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        imageUrls.push(data.publicUrl);
      }

      let specs = {};
      try {
        specs = form.specifications.trim() ? JSON.parse(form.specifications) : {};
      } catch {
        throw new Error(
          'Specifications must be valid JSON, for example: {"Power":"LED"}'
        );
      }

      const category = categories.find((c) => c.name === form.category);
      const payload = {
        name: form.name.trim(),
        price: form.price === '' ? null : Number(form.price),
        category: form.category || null,
        category_id: category?.id || null,
        description: form.description,
        specifications: specs,
        image_urls: imageUrls.slice(0, 5),
        is_active: form.is_active,
      };

      if (editing) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }

      setMessage('Product saved successfully.');
      reset();
      await load();
      storeRefresh();
    } catch (err) {
      setMessage(err.message || 'Could not save product.');
    } finally {
      setBusy(false);
    }
  };

  const deleteProduct = async (p) => {
    if (!window.confirm(`Delete ${p.name}?`)) return;
    const { error } = await supabase.from('products').delete().eq('id', p.id);
    setMessage(error?.message || 'Product deleted.');
    await load();
    storeRefresh();
  };

  const addCategory = async (e) => {
    e.preventDefault();
    const name = e.currentTarget.elements.category.value.trim();
    if (!name) return;
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const { error } = await supabase.from('categories').insert({ name, slug });
    setMessage(error?.message || 'Category added.');
    e.currentTarget.reset();
    await load();
    storeRefresh();
  };

  const deleteCategory = async (c) => {
    if (!window.confirm(`Delete category ${c.name}?`)) return;
    const { error } = await supabase.from('categories').delete().eq('id', c.id);
    setMessage(error?.message || 'Category deleted.');
    await load();
    storeRefresh();
  };

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="wordmark">
          UNI<span>MED</span><i>.</i>
        </Link>
        <span className="eyebrow">ADMINISTRATION</span>
        <button
          className={tab === 'products' ? 'active' : ''}
          onClick={() => {
            setTab('products');
            reset();
          }}
        >
          <Package size={17} /> Products
        </button>
        <button
          className={tab === 'categories' ? 'active' : ''}
          onClick={() => {
            setTab('categories');
            reset();
          }}
        >
          <SlidersHorizontal size={17} /> Categories
        </button>
        <div className="admin-sidebar-bottom">
          <span>{session.user.email}</span>
          <button onClick={onLogout}>
            Sign out <ArrowUpRight size={15} />
          </button>
          <Link to="/">
            View website <ArrowUpRight size={15} />
          </Link>
        </div>
      </aside>

      <section className="admin-content">
        <div className="admin-top">
          <div>
            <span className="eyebrow">UNI MED STORE</span>
            <h1>{tab === 'products' ? 'Products' : 'Categories'}</h1>
          </div>
          <span className="admin-user">
            <ShieldCheck size={16} /> Admin
          </span>
        </div>

        {message && (
          <div className="admin-message">
            {message}
            <button onClick={() => setMessage('')}>
              <X size={15} />
            </button>
          </div>
        )}

        {tab === 'products' && (
          <>
            <div className="admin-list-head">
              <p>{products.length} products in your catalogue</p>
              <button
                className="primary-button"
                onClick={() => {
                  reset();
                  setTab('products');
                  document
                    .getElementById('product-editor')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Plus size={17} /> Add product
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="admin-product-cell">
                          <div>
                            {p.image_urls?.[0] ? (
                              <img src={p.image_urls[0]} alt="" />
                            ) : (
                              <Package size={20} />
                            )}
                          </div>
                          <strong>{p.name}</strong>
                        </div>
                      </td>
                      <td>{p.category || '—'}</td>
                      <td>{formatPrice(p.price)}</td>
                      <td>
                        <span
                          className={`status ${p.is_active ? 'published' : 'draft'}`}
                        >
                          {p.is_active ? 'Published' : 'Hidden'}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            onClick={() => {
                              startEdit(p);
                              document
                                .getElementById('product-editor')
                                ?.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            Edit
                          </button>
                          <button onClick={() => deleteProduct(p)} aria-label="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!products.length && (
                <div className="admin-no-data">
                  No products yet. Add your first product below.
                </div>
              )}
            </div>

            <form
              id="product-editor"
              className="editor-card"
              onSubmit={saveProduct}
            >
              <div className="editor-heading">
                <div>
                  <span className="eyebrow">CATALOGUE EDITOR</span>
                  <h2>{editing ? 'Edit product' : 'Add a product'}</h2>
                </div>
                {editing && (
                  <button type="button" className="clear-cart" onClick={reset}>
                    Cancel editing
                  </button>
                )}
              </div>

              <div className="form-grid">
                <label>
                  Product name
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. LED Curing Light"
                  />
                </label>
                <label>
                  Price
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Leave empty for quote"
                  />
                </label>
                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="">Choose category</option>
                    {categories.map((c) => (
                      <option key={c.id}>{c.name}</option>
                    ))}
                  </select>
                </label>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  />{' '}
                  Visible in store
                </label>
                <label className="full-field">
                  Description
                  <textarea
                    rows="4"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the product..."
                  />
                </label>
                <label className="full-field">
                  Specifications <span className="label-hint">JSON format</span>
                  <textarea
                    rows="4"
                    value={form.specifications}
                    onChange={(e) => setForm({ ...form, specifications: e.target.value })}
                    placeholder={'{"Power":"LED","Warranty":"1 year"}'}
                  />
                </label>
                <div className="full-field upload-field">
                  <span className="field-title">
                    Product photos <small>(up to 5 images)</small>
                  </span>
                  <label className="upload-box">
                    <UploadCloud size={22} />
                    <span>Choose product photos</span>
                    <small>
                      JPG, PNG or WEBP. Add up to{' '}
                      {Math.max(0, 5 - (editing?.image_urls?.length || 0))} more.
                    </small>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setFiles(
                          Array.from(e.target.files || []).slice(
                            0,
                            Math.max(0, 5 - (editing?.image_urls?.length || 0))
                          )
                        )
                      }
                    />
                  </label>
                  <div className="photo-preview">
                    {(editing?.image_urls || []).map((src, i) => (
                      <div key={src}>
                        <img src={src} alt="Existing product" />
                        <button
                          type="button"
                          onClick={() =>
                            setEditing({
                              ...editing,
                              image_urls: editing.image_urls.filter((_, j) => j !== i),
                            })
                          }
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                    {files.map((f, i) => (
                      <div key={f.name + i}>
                        <img src={URL.createObjectURL(f)} alt="New product" />
                        <span>New</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="editor-actions">
                <button className="primary-button" disabled={busy}>
                  {busy
                    ? 'Saving...'
                    : editing
                    ? 'Save changes'
                    : 'Create product'}{' '}
                  <Check size={17} />
                </button>
              </div>
            </form>
          </>
        )}

        {tab === 'categories' && (
          <div className="category-admin">
            <form onSubmit={addCategory} className="add-category-form">
              <label>
                New category
                <input name="category" required placeholder="e.g. Dental Equipment" />
              </label>
              <button className="primary-button">
                <Plus size={17} /> Add category
              </button>
            </form>
            <div className="category-admin-list">
              {categories.map((c) => (
                <div key={c.id}>
                  <span>{c.name}</span>
                  <button onClick={() => deleteCategory(c)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}