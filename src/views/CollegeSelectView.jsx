import { useState, useCallback } from 'react';
import { COLLEGES } from '../data/constants';
import { motion } from 'framer-motion';
import './CollegeSelectView.css';

// ═══════════════════════════════════════════════════════════════════════════
//  COLLEGE SELECT — Premium Glassmorphism Interface
//  Built like Apple would — glass as physical material, not decorative filter
// ═══════════════════════════════════════════════════════════════════════════

export default function CollegeSelectView({ user, onSelect }) {
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [particles, setParticles] = useState([]);

  const handleEnter = useCallback(() => {
    if (!loading && sel && !isTransitioning) {
      setLoading(true);
      setIsTransitioning(true);
      
      // Generate particles
      const newParticles = Array.from({ length: 25 }).map((_, i) => {
        const emojis = ['🍟', '☕', '🥪', '🌮', '🥤', '🍕', '✨', '⚡'];
        const angle = (Math.PI * 1.2) * Math.random() - (Math.PI * 0.1); // Spread upward
        const velocity = 300 + Math.random() * 400; // Pixels per second vaguely
        return {
          id: i,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          x: Math.cos(angle) * velocity,
          y: -Math.sin(angle) * velocity - 100,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.8,
          duration: 0.6 + Math.random() * 0.5,
          delay: Math.random() * 0.1
        };
      });
      setParticles(newParticles);

      setTimeout(() => onSelect(sel), 1400); 
    }
  }, [loading, sel, onSelect, isTransitioning]);

  const handleCardClick = useCallback((college) => {
    if (!college.locked) setSel(college);
  }, []);

  const handleCardKeyDown = useCallback((e, college) => {
    if ((e.key === 'Enter' || e.key === ' ') && !college.locked) {
      e.preventDefault();
      setSel(college);
    }
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="cs">

      {/* ═══ LAYER 0: Rich animated gradient background ═══ */}
      <div className="cs__bg" />
      <div className="cs__orb cs__orb--1" aria-hidden="true" />
      <div className="cs__orb cs__orb--2" aria-hidden="true" />
      <div className="cs__orb cs__orb--3" aria-hidden="true" />
      <div className="cs__orb cs__orb--4" aria-hidden="true" />
      <div className="cs__orb cs__orb--5" aria-hidden="true" />

      {/* ═══ LAYER 1: Subtle blur overlay ═══ */}
      <div className="cs__blur-overlay" aria-hidden="true" />

      {/* ═══ Scrollable content ═══ */}
      <div className="cs__scroll" style={{ paddingBottom: sel ? 200 : 100 }}>
        <div className="cs__content">

          {/* ── Header ── */}
          <motion.header 
            className="cs__header"
            animate={isTransitioning ? { opacity: 0, y: -40 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.55, 0.055, 0.675, 0.19] }}
          >
            <div className="cs__header-icon" aria-hidden="true">🏫</div>
            <h1 className="cs__header-title">
              Hey {firstName}! 👋
            </h1>
            <p className="cs__header-sub">Which college are you at?</p>
            <p className="cs__header-hint">We'll show your canteen menu & timings</p>
          </motion.header>

          {/* ═══ LAYER 2: College card grid ═══ */}
          <div
            className="cs__grid"
            role="radiogroup"
            aria-label="Select your college"
          >
            {COLLEGES.map((c, i) => {
              const isSelected = sel?.id === c.id;
              const isDimmed = sel && !isSelected && !c.locked;

              // Build class list
              let cardClass = 'cs__card';
              if (isSelected) cardClass += ' cs__card--selected';
              else if (isDimmed) cardClass += ' cs__card--dimmed';
              if (c.locked) cardClass += ' cs__card--locked';

              // Card scatter animation logic
              const scatterX = i % 2 === 0 ? -150 - Math.random()*100 : 150 + Math.random()*100;
              const scatterY = i < 2 ? -150 - Math.random()*100 : 150 + Math.random()*100;
              const rotation = (Math.random() - 0.5) * 45;

              return (
                <motion.div
                  key={c.id}
                  className={cardClass}
                  initial={{ opacity: 0, y: 24, scale: 0.95 }}
                  animate={
                    isTransitioning 
                      ? { opacity: 0, x: scatterX, y: scatterY, rotate: rotation, scale: 0.8 } 
                      : { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }
                  }
                  transition={{ 
                    duration: isTransitioning ? 0.6 : 0.4, 
                    delay: isTransitioning ? 0 : i * 0.07, 
                    ease: isTransitioning ? [0.55, 0.055, 0.675, 0.19] : [0.25, 1, 0.5, 1] 
                  }}
                  whileTap={!c.locked ? { scale: 0.96 } : {}}
                  onClick={() => handleCardClick(c)}
                  onKeyDown={(e) => handleCardKeyDown(e, c)}
                  role="radio"
                  aria-checked={isSelected}
                  aria-disabled={c.locked}
                  aria-label={`${c.short} — ${c.name}${c.locked ? ', temporarily unavailable' : ''}`}
                  tabIndex={c.locked ? -1 : 0}
                  id={`college-card-${c.id}`}
                >
                  {/* Locked badge */}
                  {c.locked && (
                    <div className="cs__locked-badge">
                      <div className="cs__locked-pill">
                        <span>🔒</span>
                        <span>Temporarily Unavailable</span>
                      </div>
                    </div>
                  )}

                  {/* Checkmark */}
                  {!c.locked && isSelected && (
                    <div className="cs__check" aria-hidden="true">✓</div>
                  )}

                  {/* Icon */}
                  <div
                    className="cs__card-icon"
                    style={{ background: c.color }}
                    aria-hidden="true"
                  >
                    {c.emoji}
                  </div>

                  {/* Text */}
                  <div className="cs__card-name">{c.short}</div>
                  <div className="cs__card-full">{c.name}</div>
                  <div className="cs__card-area">📍 {c.area}</div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Empty state prompt ── */}
          {!sel && (
            <div className="cs__empty">
              <div className="cs__empty-pill">
                <span className="cs__empty-icon">👆</span>
                <span className="cs__empty-text">Tap a college card to get started</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ LAYER 3+4: Sticky CTA Footer ═══ */}
      <motion.div 
        className={`cs__footer ${sel ? 'cs__footer--visible' : ''}`}
        animate={isTransitioning ? { y: 100, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.55, 0.055, 0.675, 0.19] }}
      >
        {/* Gradient fade */}
        <div className="cs__footer-fade" aria-hidden="true" />

        {/* Footer body — stronger glass panel */}
        <div className="cs__footer-body">

          {/* Selected college info */}
          {sel && (
            <div className="cs__info">
              <div
                className="cs__info-icon"
                style={{ background: sel.color }}
                aria-hidden="true"
              >
                {sel.emoji}
              </div>
              <div className="cs__info-text">
                <div className="cs__info-name">{sel.canteen}</div>
                <div className="cs__info-meta">
                  ⏰ {sel.timing} · 👥 {sel.students}
                </div>
              </div>
              <button
                className="cs__change-btn"
                onClick={() => setSel(null)}
                aria-label="Change selected college"
                id="change-college-btn"
              >
                Change
              </button>
            </div>
          )}

          {/* CTA Button — solid gradient, no glass */}
          <motion.button
            className="cs__cta"
            onClick={handleEnter}
            disabled={loading}
            aria-label={loading ? `Entering ${sel?.short}` : `Enter ${sel?.short} Canteen`}
            id="enter-canteen-btn"
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(255,107,53,.5)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {loading ? (
              <>
                <span className="cs__spinner" />
                Entering {sel?.short}...
              </>
            ) : (
              <>
                🍽️ Enter {sel?.short} Canteen
                <span className="cs__cta-arrow">→</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* ═══ TRANSITION OVERLAYS ═══ */}
      {isTransitioning && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          {/* Particles Burst */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 200, opacity: 1, scale: 0, rotate: 0 }}
              animate={{ x: p.x, y: p.y, opacity: 0, scale: p.scale, rotate: p.rotation }}
              transition={{ duration: p.duration, delay: p.delay, ease: [0.215, 0.61, 0.355, 1] }}
              style={{ position: 'absolute', fontSize: '2rem' }}
            >
              {p.emoji}
            </motion.div>
          ))}

          {/* Shockwave */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 25, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: '#ff5e1a', position: 'absolute', bottom: '10%' }}
          />

          {/* Flash Pulse & Loader Ring */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1] }}
            transition={{ duration: 0.8, times: [0, 0.3, 1], ease: "easeInOut" }}
            style={{ position: 'absolute', inset: 0, backgroundColor: '#ff5e1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              animate={{ 
                y: [0, -25, 0],
                scale: [1, 1.15, 0.95, 1],
                rotate: [0, 10, -10, 0]
              }} 
              transition={{ 
                duration: 1.2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{ fontSize: 64, marginBottom: 20, filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }}
            >
              🍔
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ color: '#fff', fontWeight: 800, fontFamily: "'Sora', sans-serif", fontSize: 20 }}
            >
              QuickBite
            </motion.div>
          </motion.div>
        
        </div>
      )}

    </div>
  );
}