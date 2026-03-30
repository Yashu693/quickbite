import { useRef } from 'react';

export function OTPInput({ value, onChange, shake }) {
  const inputRefs = useRef([]);
  const focus = i => { if (inputRefs.current[i]) inputRefs.current[i].focus(); };
  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !e.target.value && i > 0) focus(i - 1);
    if (e.key === 'ArrowLeft' && i > 0) focus(i - 1);
    if (e.key === 'ArrowRight' && i < 5) focus(i + 1);
  };
  const handleChange = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const arr = [...value.padEnd(6, ' ')];
    arr[i] = d;
    onChange(arr.join('').replace(/ /g, ''));
    if (d && i < 5) focus(i + 1);
  };
  const handlePaste = e => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(p);
    focus(p.length > 0 ? Math.min(p.length, 5) : 0);
  };
  return (
    <div style={{ display: 'flex', gap: 9, justifyContent: 'center', marginBottom: 6 }}>
      {Array.from({ length: 6 }, (_, i) => (
        <input key={i} ref={el => inputRefs.current[i] = el}
          type="text" inputMode="numeric" maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          style={{
            width: 42, height: 50, textAlign: 'center',
            fontSize: 20, fontWeight: 800, color: 'var(--txt)',
            background: 'var(--inp)',
            border: `2px solid ${value[i] ? '#FF6B35' : 'var(--inpB)'}`,
            borderRadius: 14, transition: 'border-color .2s,transform .2s',
            animation: shake ? 'shake .45s ease' : 'none',
            transform: value[i] ? 'scale(1.04)' : 'scale(1)',
          }} />
      ))}
    </div>
  );
}
