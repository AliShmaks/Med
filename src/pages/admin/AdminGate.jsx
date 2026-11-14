import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

export function AdminGate({ storeRefresh }) {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setChecking(false);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (checking) return <div className="full-loader">Loading secure admin...</div>;

  return session ? (
    <AdminDashboard session={session} onLogout={logout} storeRefresh={storeRefresh} />
  ) : (
    <AdminLogin
      onLogin={() =>
        supabase.auth.getSession().then(({ data }) => setSession(data.session))
      }
    />
  );
}