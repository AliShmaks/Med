import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wrench, Truck, Users } from 'lucide-react';
import { Fade } from './Fade';
import { Lines } from './Lines';

const ease = [0.22, 1, 0.36, 1];

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Certified quality',
    description:
      'Equipment sourced from trusted manufacturers and checked before it reaches your clinic.',
  },
  {
    icon: Wrench,
    title: 'Local technical support',
    description:
      'Our technicians are based here. When something needs attention, we are on it — fast.',
  },
  {
    icon: Truck,
    title: 'Reliable delivery',
    description:
      'Careful handling and delivery across the country, with clear timelines from day one.',
  },
  {
    icon: Users,
    title: 'People who know healthcare',
    description:
      'Real advisors who understand your work — not just order takers.',
  },
];

export function WhyUs() {
  return (
    <section className="why-us-section section-pad" id="why-us">
      <div className="why-us-heading">
        <div>
          <Fade as="span" className="eyebrow" y={14}>
            WHY UNI MED
          </Fade>
          <h2>
            <Lines lines={['More than a supplier.', 'A partner in your work.']} />
          </h2>
        </div>
        <Fade as="p" delay={0.2}>
          We combine trusted equipment with hands-on support, so your clinic
          keeps running and your patients keep getting the care they deserve.
        </Fade>
      </div>

      <div className="why-us-grid">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.article
              key={p.title}
              className="why-us-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.8, ease, delay: i * 0.1 }}
            >
              <span className="why-us-icon">
                <Icon size={22} strokeWidth={1.8} />
              </span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <span className="why-us-index">0{i + 1}</span>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}