import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else onLogin();
    setBusy(false);
  };

  return (
    <main className="admin-auth">
      <form className="auth-card" onSubmit={submit}>
        <Link to="/" className="wordmark">
          UNI<span>MED</span><i>.</i>
        </Link>
        <span className="eyebrow">STORE MANAGEMENT</span>
        <h1>Welcome back.</h1>
        <p>Sign in to manage the UNI MED catalogue.</p>
        <label>
          Email address
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@unimed.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button className="primary-button full" disabled={busy}>
          {busy ? 'Signing in...' : 'Sign in'} <ArrowRight size={17} />
        </button>
        <Link to="/" className="back-link centered">
          <ArrowLeft size={15} /> Back to website
        </Link>
      </form>
    </main>
  );
}