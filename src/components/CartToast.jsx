import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function CartToast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDone, 1900);
    return () => clearTimeout(t);
  }, [toast, onDone]);

  return (
    <div className="toast-layer" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="cart-toast"
            role="status"
            initial={{ opacity: 0, scale: 0.92, y: -34 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -26 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          >
            <motion.span
              className="toast-check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.12, type: 'spring', damping: 12, stiffness: 360 }}
            >
              <Check size={20} strokeWidth={3} />
            </motion.span>
            <div className="toast-text">
              <strong>Added to cart</strong>
              <span>{toast.name}</span>
            </div>
            <motion.i
              className="toast-bar"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 1.9, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}