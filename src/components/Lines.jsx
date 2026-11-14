import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export function Lines({ lines, delay = 0 }) {
  return (
    <>
      {lines.map((line, i) => (
        <motion.span
          className="line-mask"
          key={i}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -70px 0px' }}
          transition={{ delayChildren: delay + i * 0.12 }}
        >
          <motion.span
            className="line-inner"
            variants={{ hidden: { y: '112%' }, show: { y: 0 } }}
            transition={{ duration: 1, ease, delay: delay + i * 0.12 }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </>
  );
}