import { useState, useCallback, useRef } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase.js';
import { QBLogo } from '../components/common/QBLogo';
import { getFriendlyError } from '../utils/helpers';
import './LoginView.css';

// ═══════════════════════════════════════════════════════════════════════════
//  LOGIN VIEW — Premium Glassmorphism · "Secure Elegance"
//  Visually cohesive with CollegeSelectView
// ═══════════════════════════════════════════════════════════════════════════

// Google SVG icon
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function LoginView({ onLogin, dark, toggleDark }) {
  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLd] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const formRef = useRef(null);

  // Focus state for floating labels
  const [focusName, setFocusName] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPass, setFocusPass] = useState(false);

  const validate = useCallback(() => {
    if (tab === 'signup' && !name.trim()) { setErr('Please enter your name'); return false; }
    if (!email.includes('@')) { setErr('Enter a valid email address'); return false; }
    if (pass.length < 6) { setErr('Password must be at least 6 characters'); return false; }
    return true;
  }, [tab, name, email, pass]);

  const triggerShake = useCallback(() => {
    setShakeKey(k => k + 1);
  }, []);

  const resetPassword = useCallback(async () => {
    if (!email.includes('@')) {
      setErr('Please enter your email address first to reset password.');
      triggerShake();
      return;
    }
    setErr(''); setLd(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert(`Password reset link sent to ${email}`);
    } catch (error) {
      setErr(getFriendlyError(error.code));
    } finally {
      setLd(false);
    }
  }, [email, triggerShake]);

  const doLogin = useCallback(async () => {
    setErr('');
    if (!validate()) { triggerShake(); return; }
    setLd(true);
    try {
      if (tab === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
      }
    } catch (error) {
      setErr(getFriendlyError(error.code));
      triggerShake();
      setLd(false);
    }
  }, [tab, email, pass, name, validate, triggerShake]);

  const googleLogin = useCallback(async () => {
    setErr('');
    setLd(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setErr(getFriendlyError(error.code));
      setLd(false);
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') doLogin();
  }, [doLogin]);

  const switchTab = useCallback((t) => {
    setTab(t);
    setErr('');
    // CRITICAL: Clear all form fields when switching tabs
    // Prevents old values leaking between login ↔ signup
    setName('');
    setEmail('');
    setPass('');
    setShowPass(false);
  }, []);

  // Helper: is floating label up?
  const isFloat = (focus, value) => focus || value.length > 0;
  // Helper: is email valid (for green border)?
  const emailValid = email.includes('@') && email.includes('.');

  return (
    <div className="lv">

      {/* ═══ LAYER 0: Animated gradient background ═══ */}
      <div className="lv__bg" aria-hidden="true" />
      <div className="lv__orb lv__orb--1" aria-hidden="true" />
      <div className="lv__orb lv__orb--2" aria-hidden="true" />
      <div className="lv__orb lv__orb--3" aria-hidden="true" />

      {/* ═══ LAYER 1: Blur overlay ═══ */}
      <div className="lv__blur-overlay" aria-hidden="true" />

      {/* Dark mode toggle */}
      <button
        className="lv__theme-btn"
        onClick={toggleDark}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        id="theme-toggle-btn"
      >
        {dark ? '☀️' : '🌙'}
      </button>

      {/* ═══ Scrollable content ═══ */}
      <div className="lv__scroll">
        <div className="lv__inner">

          {/* ── Brand header ── */}
          <div className="lv__brand">
            <div className="lv__logo-wrap">
              <QBLogo size={58} />
            </div>
            <div className="lv__app-name">QuickBite</div>
            <div className="lv__tagline">Campus Canteen · Reimagined</div>
          </div>

          {/* ── Motto pill ── */}
          <div className="lv__motto">
            <div className="lv__motto-pill">
              <span className="lv__motto-text">"Skip the queue. Claim your time."</span>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="lv__stats">
            {[['500+', 'Orders Daily'], ['4.9★', 'Rating'], ['< 5 min', 'Avg Pickup']].map(([v, l]) => (
              <div key={l} className="lv__stat">
                <div className="lv__stat-val">{v}</div>
                <div className="lv__stat-label">{l}</div>
              </div>
            ))}
          </div>

          {/* ═══ Glass form panel ═══ */}
          <div className="lv__panel" ref={formRef}>

            {/* ── Tab toggle ── */}
            <div className="lv__tabs" role="tablist" aria-label="Login or Sign Up">
              {['login', 'signup'].map(t => (
                <button
                  key={t}
                  className={`lv__tab ${tab === t ? 'lv__tab--active' : ''}`}
                  onClick={() => switchTab(t)}
                  role="tab"
                  aria-selected={tab === t}
                  aria-controls="auth-form"
                  id={`tab-${t}`}
                >
                  {t === 'login' ? 'Log In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* ── Google sign-in ── */}
            <button
              className="lv__google-btn"
              onClick={googleLogin}
              disabled={loading}
              aria-label="Continue with Google"
              id="google-signin-btn"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* ── Divider ── */}
            <div className="lv__divider" aria-hidden="true">
              <div className="lv__divider-line" />
              <span className="lv__divider-text">or with email</span>
              <div className="lv__divider-line" />
            </div>

            {/* ── Form fields ── */}
            <form
              id="auth-form"
              role="tabpanel"
              aria-labelledby={`tab-${tab}`}
              onSubmit={(e) => { e.preventDefault(); doLogin(); }}
              noValidate
            >

              {/* Name field (signup only) */}
              {tab === 'signup' && (
                <div className="lv__field lv__field--anim" style={{ animationDelay: '0.18s' }}>
                  <div className="lv__field-wrap">
                    <span className="lv__field-icon" aria-hidden="true">👤</span>
                    <label
                      className={`lv__label ${isFloat(focusName, name) ? 'lv__label--float' : ''}`}
                      htmlFor="input-name"
                    >
                      Full Name
                    </label>
                    <input
                      id="input-name"
                      className="lv__input"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onFocus={() => setFocusName(true)}
                      onBlur={() => setFocusName(false)}
                      autoComplete="name"
                      aria-required="true"
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div
                className="lv__field lv__field--anim"
                style={{ animationDelay: tab === 'signup' ? '0.24s' : '0.20s' }}
                key={`email-${shakeKey}`}
              >
                <div className="lv__field-wrap">
                  <span className="lv__field-icon" aria-hidden="true">📧</span>
                  <label
                    className={`lv__label ${isFloat(focusEmail, email) ? 'lv__label--float' : ''}`}
                    htmlFor="input-email"
                  >
                    College Email
                  </label>
                  <input
                    id="input-email"
                    className={`lv__input ${emailValid && !focusEmail ? 'lv__input--valid' : ''} ${err && !email.includes('@') ? 'lv__input--error' : ''}`}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocusEmail(true)}
                    onBlur={() => setFocusEmail(false)}
                    onKeyDown={handleKeyDown}
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={err && !email.includes('@') ? 'true' : undefined}
                  />
                </div>
              </div>

              {/* Password field */}
              <div
                className="lv__field lv__field--anim"
                style={{ animationDelay: tab === 'signup' ? '0.30s' : '0.26s' }}
              >
                <div className="lv__field-wrap">
                  <span className="lv__field-icon" aria-hidden="true">🔒</span>
                  <label
                    className={`lv__label ${isFloat(focusPass, pass) ? 'lv__label--float' : ''}`}
                    htmlFor="input-password"
                  >
                    Password
                  </label>
                  <input
                    id="input-password"
                    className={`lv__input lv__input--has-toggle ${err && pass.length < 6 && pass.length > 0 ? 'lv__input--error' : ''}`}
                    type={showPass ? 'text' : 'password'}
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                    onFocus={() => setFocusPass(true)}
                    onBlur={() => setFocusPass(false)}
                    onKeyDown={handleKeyDown}
                    autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                    aria-required="true"
                    aria-invalid={err && pass.length < 6 && pass.length > 0 ? 'true' : undefined}
                  />
                  <button
                    type="button"
                    className="lv__pass-toggle"
                    onClick={() => setShowPass(s => !s)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Forgot password (login only) */}
              {tab === 'login' && (
                <div className="lv__forgot-row">
                  <button
                    type="button"
                    className="lv__forgot-link"
                    onClick={resetPassword}
                    id="forgot-password-link"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Error message */}
              {err && (
                <div className="lv__error" role="alert" aria-live="assertive">
                  <span aria-hidden="true">⚠️</span>
                  {err}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="lv__submit"
                disabled={loading}
                aria-busy={loading}
                id="login-submit-btn"
              >
                {loading ? (
                  <>
                    <span className="lv__spinner" />
                    Please wait...
                  </>
                ) : tab === 'login' ? (
                  '🎓 Log In →'
                ) : (
                  '🚀 Create Account →'
                )}
              </button>
            </form>

            {/* SSL notice */}
            <div className="lv__ssl">🔐 SSL Secured · Session persists after close</div>
          </div>

          {/* Bottom spacer */}
          <div style={{ height: 24 }} />
        </div>
      </div>
    </div>
  );
}
