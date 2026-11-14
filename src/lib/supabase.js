import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key && !url.includes('YOUR_PROJECT'));
export const supabase = isSupabaseConfigured ? createClient(url, key) : null;

export const currency = import.meta.env.VITE_CURRENCY || 'USD';
export const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || '96171945469').replace(/\D/g, '');

export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return 'Request a quote';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(value));
}
