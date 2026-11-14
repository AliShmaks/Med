import { whatsappNumber } from '../lib/supabase';

export function whatsappUrl(message) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}