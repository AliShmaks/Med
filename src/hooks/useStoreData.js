import { useCallback, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { fallbackProducts, demoCategories } from '../data/fallback';

export function useStoreData() {
  const [products, setProducts] = useState(fallbackProducts);
  const [categories, setCategories] = useState(
    demoCategories.map((name, i) => ({
      id: `demo-cat-${i}`,
      name,
      slug: name.toLowerCase().replaceAll(' ', '-'),
    }))
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [usingDemo, setUsingDemo] = useState(!isSupabaseConfigured);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setUsingDemo(true);
      return;
    }
    setLoading(true);
    const [p, c] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]);
    if (!p.error) {
      setProducts(p.data || []);
      setUsingDemo(false);
    }
    if (!c.error) setCategories(c.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { products, categories, loading, usingDemo, refresh };
}