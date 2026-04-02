import { useMemo } from 'react';
import { QBLogo } from '../common/QBLogo';
import { TAB_ROUTES } from '../../data/routes';
import { motion } from 'framer-motion';

export function BottomNav({ view, go, cartCount = 0 }) {
  const activeIndex = useMemo(() => {
    return TAB_ROUTES.findIndex(
      t => (t.route === 'orders' && view === 'history') || t.route === view
    );
  }, [view]);

  const safeIndex = activeIndex === -1 ? 0 : activeIndex;
  const tabWidth = 100 / TAB_ROUTES.length;

  return (
    <div style={{
      position: 'absolute',
      bottom: 24, 
      left: 20,
      right: 20,
      zIndex: 50,
      display: 'flex',
      justifyContent: 'center'
    }}>
      <nav style={{
        position: 'relative',
        width: '100%',
        maxWidth: 360, 
        height: 70,
        borderRadius: 35, 
        background: 'var(--glass)', // Let the theme provide the base layer
        backdropFilter: 'blur(36px) saturate(120%)', // Reduced saturation to stop dark-mode background colors from "burning" through as muddy brown
        WebkitBackdropFilter: 'blur(36px) saturate(120%)',
        border: '1px solid var(--glassB)', 
        boxShadow: '0 16px 40px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.08)',
        display: 'flex', 
        alignItems: 'center',
        padding: '0 8px',
      }}>
        
        {/* Liquid Sliding Pill Indicator */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.8 }}
          style={{
            position: 'absolute',
            top: 8,
            bottom: 8,
            width: `calc(${tabWidth}% - 16px)`,
            left: 8,
            transform: `translateX(calc(${safeIndex * 100}% + ${safeIndex * 16}px))`,
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          <div style={{
            width: '100%', 
            height: '100%',
            borderRadius: 28, 
            background: 'rgba(150, 150, 160, 0.18)',
            boxShadow: 'none',
            border: 'none'
          }} />
        </motion.div>

        {/* Tabs Layout */}
        <div style={{ display: 'flex', width: '100%', height: '100%', zIndex: 1, position: 'relative' }}>
          {TAB_ROUTES.map((t, idx) => {
            const active = idx === safeIndex;
            const viewTarget = t.route === 'orders' ? 'history' : t.route;
            
            return (
              <div 
                key={t.route} 
                onClick={() => go(viewTarget)}
                style={{
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4, 
                  cursor: 'pointer',
                  transform: active ? 'scale(1.02)' : 'scale(1)',
                  opacity: active ? 1 : 0.45, // Pure opacity knockback instead of relying on a potentially illegible var(--mut)
                  transition: 'all 200ms cubic-bezier(0.25, 1, 0.5, 1)',
                  WebkitTapHighlightColor: 'transparent',
                }}>
                
                <div style={{
                  position: 'relative',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: 22, 
                  color: 'var(--txt)', // Always use primary text color, let opacity handle the visual hierarchy
                  height: 26,
                  transition: 'color 200ms ease'
                }}>
                  {t.route === 'home' && active ? <QBLogo size={23} /> : t.icon}
                  
                  {/* Refined Cart Badge */}
                  {t.route === 'orders' && cartCount > 0 && (
                    <div style={{
                      position: 'absolute', 
                      top: -4, 
                      right: -8,
                      minWidth: 16, 
                      height: 16, 
                      borderRadius: 16,
                      background: 'var(--acc)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: 9, 
                      fontWeight: 800, 
                      color: '#fff',
                      padding: '0 4px', 
                      boxShadow: '0 2px 6px rgba(0,0,0,.2)',
                      border: '2px solid var(--card)', 
                    }}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </div>
                  )}
                </div>

                <div style={{
                  fontSize: 10, 
                  fontWeight: active ? 700 : 500,
                  color: 'var(--txt)', // Always use primary text color, let opacity handle the visual hierarchy
                  transition: 'all 200ms ease',
                }}>
                  {t.name}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
