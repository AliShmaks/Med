import { useEffect, useState } from 'react';

export function useCart() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('unimed-cart') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('unimed-cart', JSON.stringify(items));
  }, [items]);

  const add = (product) =>
    setItems((old) => {
      const found = old.find((x) => x.id === product.id);
      return found
        ? old.map((x) =>
            x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x
          )
        : [...old, { ...product, quantity: 1 }];
    });

  const change = (id, delta) =>
    setItems((old) =>
      old.map((x) =>
        x.id === id ? { ...x, quantity: Math.max(1, x.quantity + delta) } : x
      )
    );

  const remove = (id) => setItems((old) => old.filter((x) => x.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((n, x) => n + x.quantity, 0);
  const total = items.reduce(
    (n, x) => n + (Number(x.price) || 0) * x.quantity,
    0
  );

  return { items, add, change, remove, clear, count, total };
}