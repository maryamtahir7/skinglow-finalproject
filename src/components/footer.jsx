import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategories } from '../backend/database';
import {
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUp,
  MapPin,
} from 'lucide-react';
import './footer.css';

export default function Footer() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await getCategories();
        setCategories(res.documents?.slice(0, 5) || []);
      } catch (e) {
        console.error('Footer category fetch error', e);
      }
    }
    fetchCats();
  }, []);

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const support = [
    { name: 'Help Center', path: '/support' },
    { name: 'Return Policy', path: '/returns' },
    { name: 'Shipping Info', path: '/shipping' },
    { name: 'Skin Quiz', path: '/skin-quiz' },
  ];

  const legal = [
    { name: 'Privacy', path: '/privacy-policy' },
    { name: 'Terms', path: '/terms' },
    { name: 'License', path: '/license' },
  ];

  const socials = [
    { icon: Instagram, url: 'https://instagram.com', label: 'Instagram' },
    { icon: Facebook, url: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, url: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, url: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  const onSubscribe = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="sg-footer">
      <div className="sg-footer__inner">
        <motion.div
          className="sg-footer__brand-row"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <div className="sg-footer__brand">
            <button type="button" className="sg-footer__logo" onClick={() => navigate('/')}>
              Skin<em>Glow</em>
            </button>
            <p className="sg-footer__tagline">
              Where clean science meets quiet luxury — botanical rituals for luminous skin.
            </p>
          </div>

          <div className="sg-footer__socials">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sg-footer__social"
                aria-label={s.label}
              >
                <s.icon size={15} strokeWidth={1.6} />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="sg-footer__grid"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <div>
            <h4 className="sg-footer__col-title">Visit</h4>
            <div className="sg-footer__contact">
              <span className="sg-footer__contact-item">
                <MapPin />
                Punjab, Pakistan
              </span>
              <a href="mailto:glow@skinglow.com" className="sg-footer__contact-item">
                <Mail />
                glow@skinglow.com
              </a>
            </div>
          </div>

          <div>
            <h4 className="sg-footer__col-title">Explore</h4>
            <ul className="sg-footer__list">
              {quickLinks.map((l) => (
                <li key={l.path}>
                  <button type="button" className="sg-footer__link" onClick={() => navigate(l.path)}>
                    {l.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="sg-footer__col-title">Rituals</h4>
            <ul className="sg-footer__list">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.$id || cat.id || cat.name}>
                    <button
                      type="button"
                      className="sg-footer__link"
                      onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))
              ) : (
                <li>
                  <button type="button" className="sg-footer__link" onClick={() => navigate('/products')}>
                    Shop collection
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="sg-footer__col-title">Care</h4>
            <ul className="sg-footer__list">
              {support.map((l) => (
                <li key={l.path}>
                  <button type="button" className="sg-footer__link" onClick={() => navigate(l.path)}>
                    {l.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          className="sg-footer__news"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <div>
            <span className="sg-footer__news-eyebrow">The glow list</span>
            <h4 className="sg-footer__news-title">Rituals, tips & early access</h4>
            <p className="sg-footer__news-text">
              Join for skincare notes and member-only drops — no noise, only radiance.
            </p>
          </div>

          <form className="sg-footer__form" onSubmit={onSubscribe}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="sg-footer__input"
              aria-label="Email for newsletter"
            />
            <button type="submit" className="sg-footer__submit">
              Subscribe
            </button>
          </form>
        </motion.div>

        <div className="sg-footer__bottom">
          <p className="sg-footer__copy">
            © {new Date().getFullYear()} SkinGlow. All rights reserved.
          </p>

          <div className="sg-footer__legal">
            {legal.map((l) => (
              <button
                key={l.path}
                type="button"
                className="sg-footer__legal-link"
                onClick={() => navigate(l.path)}
              >
                {l.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="sg-footer__top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Back to top"
            aria-label="Back to top"
          >
            <ArrowUp size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </footer>
  );
}
