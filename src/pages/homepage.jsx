import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { getProducts, getCategories } from '../backend/database';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getCurrentUser } from '../backend/auth';
import { ArrowRight } from 'lucide-react';
import './homepage.css';

/* Premium cinematic beauty imagery — your pin URLs (1200x for clarity) */
const HERO_IMAGES = [
  {
    src: 'https://i.pinimg.com/1200x/34/e4/5b/34e45b6b6158f541b6fa9f70c55fe41a.jpg',
    position: 'center 20%',
  },
  {
    src: 'https://i.pinimg.com/736x/f4/d0/94/f4d094963e6105cf33716d47a52ab7cd.jpg',
    position: 'center 28%',
  },
  {
    src: 'https://i.pinimg.com/736x/3e/a0/2c/3ea02cc6668815589bc0a6df2c86145d.jpg',
    position: 'center 24%',
  },
];

const FLOAT_LAYERS = [
  {
    src: 'https://i.pinimg.com/1200x/a1/32/e2/a132e2bd0ae39c1b56c3dfd4b4f6a75a.jpg',
    className: 'sg-float sg-float--1',
    depth: 55,
    delay: 0,
  },
  {
    src: 'https://i.pinimg.com/1200x/98/f9/88/98f9889c8d63fbf1f73f0959bc38dd68.jpg',
    className: 'sg-float sg-float--2',
    depth: 90,
    delay: 0.4,
  },
  {
    src: 'https://i.pinimg.com/1200x/68/c8/5a/68c85a578825f1aaf47f461455bbb8ee.jpg',
    className: 'sg-float sg-float--3',
    depth: 70,
    delay: 0.8,
  },
];

const PILLARS = [
  { title: 'Botanical purity', desc: 'Plant-led formulas, free from harsh fillers and empty promises.', img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=85' },
  { title: 'Cruelty free', desc: 'Ethically crafted — never tested on animals, always kind by design.', img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=85' },
  { title: 'Clean science', desc: 'No parabens, sulfates, or toxins. Only what your skin needs.', img: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=700&q=85' },
  { title: 'Clinic trusted', desc: 'Dermatologist-tested for sensitive, reactive, and radiant skin alike.', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85' },
];

const CONCERNS = [
  {
    title: 'Acne & blemishes',
    query: 'acne',
    image: 'https://i.pinimg.com/1200x/f4/d0/94/f4d094963e6105cf33716d47a52ab7cd.jpg',
    position: 'center 30%',
  },
  {
    title: 'Dryness & hydration',
    query: 'dryness',
    image: 'https://i.pinimg.com/1200x/d6/56/67/d656677dee0b0c3c7a6ead98256a6e04.jpg',
    position: 'center 35%',
  },
  {
    title: 'Anti-aging',
    query: 'aging',
    image: 'https://i.pinimg.com/1200x/25/c2/ac/25c2ac42d0755eb68d93e38bb8170794.jpg',
    position: 'center 28%',
  },
  {
    title: 'Dullness & brightening',
    query: 'dullness',
    image: 'https://i.pinimg.com/1200x/68/2d/11/682d11136e2e7e0ff4af4e2678a02547.jpg',
    position: 'center 32%',
  },
];

const CAT_FALLBACKS = [
  'https://i.pinimg.com/1200x/d3/2b/46/d32b46b053bab5ede76153cefd912d8b.jpg',
  'https://images.unsplash.com/photo-1620916565600-cfab6c5dca22?auto=format&fit=crop&w=1200&q=90',
  'https://images.unsplash.com/photo-1570554880355-ea666b55a237?auto=format&fit=crop&w=1200&q=90',
  'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=90',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=90',
];

const fadeUp = {
  hidden: { opacity: 0, y: 48, rotateX: 12 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.85, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

/** Pinterest CDN often blocks hotlinking unless referrer is omitted */
function PremiumImg({ src, alt = '', className = '', style, loading = 'eager', ...rest }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      {...rest}
    />
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** Floating 3D plane — mouse parallax on outer, continuous motion on inner */
function FloatLayer({ src, className, depth, smoothX, smoothY, delay = 0 }) {
  const x = useTransform(smoothX, (v) => v * depth);
  const y = useTransform(smoothY, (v) => v * (depth * 0.75));
  const rotateY = useTransform(smoothX, (v) => v * 14);
  const rotateX = useTransform(smoothY, (v) => -v * 10);

  return (
    <motion.div
      className={className}
      style={{ x, y, rotateY, rotateX }}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.35 + delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="sg-float__bob" style={{ animationDelay: `${delay}s` }}>
        <div className="sg-float__card">
          <PremiumImg src={src} alt="" />
          <span className="sg-float__rim" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
}

/** Mouse-driven 3D tilt card */
function Tilt3D({ children, className = '', max = 14, onClick }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springRx = useSpring(rx, { stiffness: 180, damping: 18 });
  const springRy = useSpring(ry, { stiffness: 180, damping: 18 });

  const onMove = (e) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * max * 2);
    rx.set((0.5 - py) * max * 2);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`sg-tilt ${className}`}
      style={{
        rotateX: springRx,
        rotateY: springRy,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
    >
      <div className="sg-tilt__inner" style={{ transform: 'translateZ(28px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
}

function Homepage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const navigate = useNavigate();
  const { setUser } = useUser();
  const reduced = usePrefersReducedMotion();
  const heroRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 90, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 90, damping: 18 });

  // Window scroll — avoid useScroll({ target: ref }) while hero may be unmounted during loading
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 180]);
  const heroScale = useTransform(scrollY, [0, 900], [1, reduced ? 1 : 1.12]);
  const textY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : -80]);

  useEffect(() => {
    async function checkOAuthUser() {
      try {
        const user = await getCurrentUser();
        if (user) setUser(user);
      } catch {
        /* guest ok */
      }
    }
    checkOAuthUser();
  }, [setUser]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodData, catData] = await Promise.all([getProducts(), getCategories()]);
        setProducts((prodData.documents || []).slice(0, 4));
        setCategories((catData.documents || []).slice(0, 5));
      } catch (error) {
        console.error('Homepage fetch error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 7500);
    return () => clearInterval(id);
  }, []);

  const onHeroMove = (e) => {
    if (reduced || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2.4;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2.4;
    mouseX.set(x);
    mouseY.set(y);
  };

  if (loading) {
    return (
      <div className="sg-home-loader">
        <div className="sg-home-loader__orb" />
        <p className="sg-home-loader__brand">SkinGlow</p>
      </div>
    );
  }

  return (
    <div className="sg-home">
      {/* ═══════════ HERO 3D ═══════════ */}
      <section
        className="sg-hero"
        ref={heroRef}
        aria-label="SkinGlow hero"
        onMouseMove={onHeroMove}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      >
        <motion.div className="sg-hero__media" style={{ y: heroY, scale: heroScale }} aria-hidden="true">
          {HERO_IMAGES.map((slide, i) => (
            <PremiumImg
              key={slide.src}
              src={slide.src}
              alt=""
              className={`sg-hero__img${i === heroIndex ? ' is-active' : ''}`}
              style={{ objectPosition: slide.position }}
            />
          ))}
          <div className="sg-hero__veil" />
          <div className="sg-hero__grain" />
          <div className="sg-hero__orb sg-hero__orb--a" />
          <div className="sg-hero__orb sg-hero__orb--b" />
        </motion.div>

        {/* Floating 3D product planes */}
        <div className="sg-hero__stage" aria-hidden="true">
          {FLOAT_LAYERS.map((layer) => (
            <FloatLayer
              key={layer.className}
              src={layer.src}
              className={layer.className}
              depth={layer.depth}
              delay={layer.delay}
              smoothX={smoothX}
              smoothY={smoothY}
            />
          ))}
        </div>

        <motion.div className="sg-hero__content" style={{ y: textY }}>
          <motion.h1
            className="sg-hero__brand"
            initial={{ opacity: 0, y: 40, rotateX: 18 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            SkinGlow
          </motion.h1>
          <motion.p
            className="sg-hero__headline"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            Radiance, refined for the ritual of everyday beauty.
          </motion.p>
          <motion.p
            className="sg-hero__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.28 }}
          >
            Clean botanical skincare — crafted to leave skin luminous, calm, and unmistakably you.
          </motion.p>
          <motion.div
            className="sg-hero__ctas"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            <button type="button" className="sg-btn sg-btn--solid" onClick={() => navigate('/products')}>
              Shop the collection
              <ArrowRight size={15} strokeWidth={2} />
            </button>
            <button type="button" className="sg-btn sg-btn--ghost" onClick={() => navigate('/skin-quiz')}>
              Find your ritual
            </button>
          </motion.div>
        </motion.div>

        <div className="sg-hero__scroll" aria-hidden="true">
          <span>Scroll</span>
          <span className="sg-hero__scroll-line" />
        </div>
      </section>

      {/* ═══════════ MANIFESTO ═══════════ */}
      <section className="sg-manifesto">
        <div className="sg-manifesto__orb" aria-hidden="true" />
        <motion.div
          className="sg-manifesto__inner"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          style={{ perspective: 1000 }}
        >
          <p className="sg-manifesto__quote">
            Beauty is not a performance — it is a quiet return to your own light.
          </p>
          <div className="sg-manifesto__rule" />
          <p className="sg-manifesto__text">
            At SkinGlow, every formula is a study in restraint: fewer ingredients, deeper care,
            and results you can feel before you see.
          </p>
        </motion.div>
      </section>

      {/* ═══════════ PILLARS 3D ═══════════ */}
      <section className="sg-section sg-pillars">
        <div className="sg-section__inner">
          <motion.div
            className="sg-section__head"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
          >
            <span className="sg-section__eyebrow">Our promise</span>
            <h2 className="sg-section__title">Clean. Conscious. Clinical.</h2>
            <p className="sg-section__sub">
              Four pillars that guide every serum, cream, and cleanser we place in your hands.
            </p>
          </motion.div>

          <div className="sg-pillars__grid sg-scene-3d">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
              >
                <Tilt3D className="sg-pillar-tilt" max={12}>
                  <article className="sg-pillar sg-pillar--3d">
                    <div className="sg-pillar__media">
                      <img src={p.img} alt="" loading="lazy" />
                    </div>
                    <div className="sg-pillar__index">0{i + 1}</div>
                    <h3 className="sg-pillar__title">{p.title}</h3>
                    <p className="sg-pillar__desc">{p.desc}</p>
                  </article>
                </Tilt3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES 3D ═══════════ */}
      {categories.length > 0 && (
        <section className="sg-section sg-cats">
          <div className="sg-section__inner">
            <motion.div
              className="sg-section__head"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeUp}
            >
              <span className="sg-section__eyebrow">The collection</span>
              <h2 className="sg-section__title">Shop by ritual</h2>
              <p className="sg-section__sub">
                From first cleanse to final glow — build a routine that feels like ceremony.
              </p>
            </motion.div>
            <div className="sg-cats__grid sg-scene-3d">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.$id || cat.id || i}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  className="sg-cats__cell"
                >
                  <Tilt3D
                    className="sg-cat-tilt"
                    max={10}
                    onClick={() =>
                      navigate(`/products?category=${encodeURIComponent(cat.name)}`)
                    }
                  >
                    <span className="sg-cat">
                      <PremiumImg
                        src={cat.imageUrl || CAT_FALLBACKS[i % CAT_FALLBACKS.length]}
                        alt={cat.name || ''}
                        loading="lazy"
                      />
                      <span className="sg-cat__veil" />
                      <span className="sg-cat__label">
                        <span className="sg-cat__name">{cat.name}</span>
                        <span className="sg-cat__hint">Explore</span>
                      </span>
                    </span>
                  </Tilt3D>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ CONCERNS 3D ═══════════ */}
      <section className="sg-section sg-concerns">
        <div className="sg-section__inner">
          <motion.div
            className="sg-section__head"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
          >
            <span className="sg-section__eyebrow">Targeted care</span>
            <h2 className="sg-section__title">Shop by concern</h2>
            <p className="sg-section__sub">
              Precise edits for the skin you have — and the glow you want.
            </p>
          </motion.div>
          <div className="sg-concerns__grid sg-scene-3d">
            {CONCERNS.map((item, i) => (
              <motion.div
                key={item.query}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
              >
                <Tilt3D
                  className="sg-concern-tilt"
                  max={11}
                  onClick={() => navigate(`/products?concern=${item.query}`)}
                >
                  <span className="sg-concern">
                    <span className="sg-concern__frame" aria-hidden="true" />
                    <PremiumImg
                      src={item.image}
                      alt={item.title}
                      className="sg-concern__img"
                      loading="lazy"
                      style={{ objectPosition: item.position || 'center center' }}
                    />
                    <span className="sg-concern__shine" />
                    <span className="sg-concern__body">
                      <span className="sg-concern__index">0{i + 1}</span>
                      <span className="sg-concern__title">{item.title}</span>
                      <span className="sg-concern__cta">Explore the edit →</span>
                    </span>
                  </span>
                </Tilt3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PRODUCTS 3D ═══════════ */}
      <section className="sg-section sg-products">
        <div className="sg-section__inner">
          <div className="sg-products__head">
            <motion.div
              className="sg-section__head"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeUp}
            >
              <span className="sg-section__eyebrow">Essentials</span>
              <h2 className="sg-section__title">Trending now</h2>
              <p className="sg-section__sub">
                The pieces defining SkinGlow rituals this season.
              </p>
            </motion.div>
            <button
              type="button"
              className="sg-products__link"
              onClick={() => navigate('/products')}
            >
              View all →
            </button>
          </div>

          <div className="sg-products__grid sg-scene-3d">
            {products.length > 0
              ? products.map((product, i) => (
                  <motion.div
                    key={product.$id || product.id}
                    custom={i}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                  >
                    <Tilt3D
                      className="sg-product-tilt"
                      max={16}
                      onClick={() => navigate(`/products/${product.$id || product.id}`)}
                    >
                      <span className="sg-product sg-product--3d">
                        <span className="sg-product__media">
                          <img src={product.imageUrl} alt={product.name} loading="lazy" />
                          <span className="sg-product__reflection" />
                        </span>
                        <span className="sg-product__cat">
                          {product.category || 'Skincare'}
                        </span>
                        <span className="sg-product__name">{product.name}</span>
                        <span className="sg-product__price">Rs. {product.price}</span>
                      </span>
                    </Tilt3D>
                  </motion.div>
                ))
              : [1, 2, 3, 4].map((n) => (
                  <div key={n} className="sg-product__skel" aria-hidden="true" />
                ))}
          </div>
        </div>
      </section>

      {/* ═══════════ RITUAL ═══════════ */}
      <section className="sg-ritual">
        <div className="sg-ritual__inner">
          <div className="sg-ritual__copy">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              variants={fadeUp}
            >
              <span className="sg-ritual__eyebrow">Personalized care</span>
              <h2 className="sg-ritual__title">
                Your skin is unique. <em>Your routine should be too.</em>
              </h2>
              <p className="sg-ritual__sub">
                A two-minute skin analysis — tailored recommendations, morning and night rituals,
                shaped around your exact concerns.
              </p>
              <button
                type="button"
                className="sg-btn sg-btn--rose"
                onClick={() => navigate('/skin-quiz')}
              >
                Begin analysis
                <ArrowRight size={15} strokeWidth={2} />
              </button>
            </motion.div>
          </div>

          <motion.div
            className="sg-ritual__visual"
            initial={{ opacity: 0, x: 48, rotateY: -12 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="sg-ritual__frame">
              <PremiumImg
                className="sg-ritual__photo"
                src="https://i.pinimg.com/1200x/fd/9c/92/fd9c921be8385ffea3f9c9eedfc96c61.jpg"
                alt="Luxury skincare ritual"
                loading="lazy"
              />
              <span className="sg-ritual__glow" aria-hidden="true" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ CLOSE ═══════════ */}
      <section className="sg-close">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
        >
          <p className="sg-close__brand">SkinGlow</p>
          <p className="sg-close__text">Where clean science meets quiet luxury.</p>
          <button
            type="button"
            className="sg-btn sg-btn--ghost sg-close__ai"
            onClick={() => navigate('/ai-chat')}
          >
            Ask the AI Esthetician
            <ArrowRight size={15} strokeWidth={2} />
          </button>
        </motion.div>
      </section>
    </div>
  );
}

export default Homepage;
