import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Stethoscope,
} from 'lucide-react';
import { Fade } from '../components/Fade';
import { Lines } from '../components/Lines';
import { ScrollLink } from '../components/ScrollLink';
import { ProductGrid } from '../components/ProductGrid';
import { WhyUs } from '../components/WhyUs';

export function Home({ store, cart }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(
    () =>
      activeCategory === 'All'
        ? store.products
        : store.products.filter(
            (p) => p.category === activeCategory || p.category_id === activeCategory
          ),
    [activeCategory, store.products]
  );

  const heroRef = useRef(null);
  const supRef = useRef(null);

  const { scrollYProgress: hp } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const copyY = useTransform(hp, [0, 1], [0, -70]);
  const copyOpacity = useTransform(hp, [0, 0.75], [1, 0]);
  const imgY = useTransform(hp, [0, 1], ['0%', '8%']);
  const imgScale = useTransform(hp, [0, 1], [1.08, 1.2]);
  const noteY = useTransform(hp, [0, 1], [0, -55]);
  const orbitY = useTransform(hp, [0, 1], [0, 100]);

  const { scrollYProgress: sp } = useScroll({
    target: supRef,
    offset: ['start end', 'end start'],
  });
  const supY = useTransform(sp, [0, 1], ['-8%', '8%']);

  return (
    <>
      <section className="hero" ref={heroRef}>
        <div className="hero-inner">
          <motion.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
            <Fade as="span" className="eyebrow" y={14}>
              YOUR PARTNER IN HEALTHCARE
            </Fade>
            <h1>
              <Lines
                delay={0.1}
                lines={[
                  'Equipping care.',
                  <span className="accent" key="a">
                    Supporting people.
                  </span>,
                ]}
              />
            </h1>
            <Fade as="p" delay={0.45}>
              Medical and dental equipment, backed by local technical support. From
              choosing your equipment to keeping it working, UNI MED is by your side.
            </Fade>
            <Fade delay={0.6}>
              <ScrollLink to="catalog" className="text-cta">
                Explore our equipment <ArrowDown size={16} />
              </ScrollLink>
            </Fade>
          </motion.div>

          <motion.div
            className="hero-art"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15 }}
          >
            <div className="hero-image-main">
              <motion.img
                style={{ y: imgY, scale: imgScale }}
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1300&q=90"
                alt="Modern dental clinic"
              />
            </div>
            <motion.div className="hero-image-note" style={{ y: noteY }}>
              <span className="note-icon">
                <Stethoscope size={17} />
              </span>
              <span>
                Care starts with
                <br />
                <strong>the right equipment.</strong>
              </span>
            </motion.div>
            <motion.div className="hero-orbit" style={{ y: orbitY }} />
          </motion.div>
        </div>
        <div className="hero-bottom">
          <span>MEDICAL & DENTAL SOLUTIONS</span>
          <span>01 — 03</span>
        </div>
      </section>

      <section className="catalog-section section-pad" id="catalog" data-scroll-offset="50">
        <div className="section-heading">
          <div>
            <Fade as="span" className="eyebrow" y={14}>
              THE UNI MED SELECTION
            </Fade>
            <h2>
              <Lines lines={['Equipment for', 'better care.']} />
            </h2>
          </div>
          <Fade className="desktop-only" delay={0.2}>
            <Link to="/products" className="text-cta">
              View all products <ArrowUpRight size={16} />
            </Link>
          </Fade>
        </div>

        <Fade className="category-pills" delay={0.15}>
          <button
            className={activeCategory === 'All' ? 'selected' : ''}
            onClick={() => setActiveCategory('All')}
          >
            All products
          </button>
          {store.categories.map((c) => (
            <button
              key={c.id}
              className={activeCategory === c.name ? 'selected' : ''}
              onClick={() => setActiveCategory(c.name)}
            >
              {c.name}
            </button>
          ))}
        </Fade>

        <ProductGrid
          products={filtered.slice(0, 8)}
          onAdd={cart.add}
          loading={store.loading}
        />

        <div className="mobile-view-all">
          <Link to="/products" className="text-cta">
            Explore all products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <WhyUs />

      <section className="support-section" id="about" ref={supRef}>
        <motion.div
          className="support-image"
          initial={{ clipPath: 'inset(10% 10% 10% 10%)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            style={{ y: supY }}
            src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1200&q=85"
            alt="Dental care equipment"
            loading="lazy"
          />
        </motion.div>
        <div className="support-copy">
          <Fade as="span" className="eyebrow" y={14}>
            MORE THAN EQUIPMENT
          </Fade>
          <h2>
            <Lines lines={['Here for the work', 'you do every day.']} />
          </h2>
          <Fade as="p" delay={0.2}>
            Choosing the right equipment is only the beginning. UNI MED is here to
            help healthcare professionals find the right solutions and keep their
            equipment working with local technical support.
          </Fade>
          <Fade delay={0.3}>
            <Link to="/contact" className="text-cta">
              Get in touch <ArrowUpRight size={16} />
            </Link>
          </Fade>
        </div>
      </section>
    </>
  );
}