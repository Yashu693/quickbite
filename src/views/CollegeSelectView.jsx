import { useState, useCallback } from 'react';
import { COLLEGES } from '../data/constants';
import './CollegeSelectView.css';

// ═══════════════════════════════════════════════════════════════════════════
//  COLLEGE SELECT — Premium Glassmorphism Interface
//  Built like Apple would — glass as physical material, not decorative filter
// ═══════════════════════════════════════════════════════════════════════════

export default function CollegeSelectView({ user, onSelect }) {
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEnter = useCallback(() => {
    if (!loading && sel) {
      setLoading(true);
      setTimeout(() => onSelect(sel), 1300);
    }
  }, [loading, sel, onSelect]);

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
          <header className="cs__header">
            <div className="cs__header-icon" aria-hidden="true">🏫</div>
            <h1 className="cs__header-title">
              Hey {firstName}! 👋
            </h1>
            <p className="cs__header-sub">Which college are you at?</p>
            <p className="cs__header-hint">We'll show your canteen menu & timings</p>
          </header>

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

              return (
                <div
                  key={c.id}
                  className={cardClass}
                  style={{ animationDelay: `${i * 0.065}s` }}
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
                </div>
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
      <div className={`cs__footer ${sel ? 'cs__footer--visible' : ''}`}>
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
          <button
            className="cs__cta"
            onClick={handleEnter}
            disabled={loading}
            aria-label={loading ? `Entering ${sel?.short}` : `Enter ${sel?.short} Canteen`}
            id="enter-canteen-btn"
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
          </button>
        </div>
      </div>
    </div>
  );
}