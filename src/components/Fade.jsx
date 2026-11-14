import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export function Fade({ as = 'div', children, delay = 0, y = 26, className }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.85, ease, delay }}
    >
      {children}
    </M>
  );
}