import { useState } from 'react';

const FAQS = [
  { q: 'How long does delivery take?', a: 'Standard delivery usually takes 20-30 minutes across the campus, depending on your selected canteen and time of day.' },
  { q: 'Can I cancel my order?', a: 'You can cancel your order within the first 3 minutes of placing it. Once the canteen starts preparation, cancellations are disabled.' },
  { q: 'Are there any hidden delivery fees?', a: 'No, all fees including taxes and delivery charges (if any) are clearly mentioned on the checkout screen.' },
  { q: 'What happens if my food is cold or incorrect?', a: 'You can use the "Send Feedback" option in your Profile settings. Provide a photo, and our campus team will issue a refund or replacement.' },
  { q: 'Can I pay with Cash on Delivery?', a: 'Yes! QuickBite supports UPI, Cards, and Cash on Delivery for most network canteens.' },
  { q: 'Where do you deliver?', a: 'We currently deliver to all active dorms, library halls, and academic buildings within the selected campus area.' }
];

export const HelpSupport = ({ close, addToast }) => {
  const [openId, setOpenId] = useState(null);
  const [chatStarted, setChatStarted] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const toast = (t) => { if (typeof addToast === 'function') addToast(t); };

  const toggle = (i) => {
    setOpenId(openId === i ? null : i);
  };

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    const userMsg = chatMsg.trim();
    setChatHistory(prev => [...prev, { from: 'user', text: userMsg }]);
    setChatMsg('');

    // Simulate auto-reply
    setTimeout(() => {
      const replies = [
        "Thanks for reaching out! A support agent will review your query shortly.",
        "We've noted your concern. Our campus team usually responds within 24 hours.",
        "Got it! Meanwhile, you can check our FAQs below for quick answers.",
        "Your message has been logged. We'll get back to you via email soon."
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setChatHistory(prev => [...prev, { from: 'bot', text: reply }]);
    }, 1200);
  };

  if (chatStarted) {
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <button onClick={() => setChatStarted(false)} className="press" style={{ width: 36, height: 36, borderRadius: 12, border: '1px solid var(--bdr)', background: 'var(--inp)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif" }}>💬 Live Chat</div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>Online</span>
          </div>
        </div>

        <div style={{ minHeight: 200, maxHeight: 300, overflowY: 'auto', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ padding: '10px 14px', borderRadius: '4px 14px 14px 14px', background: 'var(--inp)', maxWidth: '80%', alignSelf: 'flex-start' }}>
            <div style={{ fontSize: 12, color: 'var(--txt)' }}>Hi there! 👋 How can we help you today?</div>
            <div style={{ fontSize: 9, color: 'var(--mut)', marginTop: 4 }}>QuickBite Support</div>
          </div>
          {chatHistory.map((msg, i) => (
            <div key={i} style={{ 
              padding: '10px 14px', borderRadius: msg.from === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px', 
              background: msg.from === 'user' ? 'linear-gradient(135deg,#FF6B35,#FF3D60)' : 'var(--inp)',
              color: msg.from === 'user' ? '#fff' : 'var(--txt)',
              maxWidth: '80%', alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start', fontSize: 12
            }}>
              {msg.text}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <input 
            value={chatMsg} 
            onChange={e => setChatMsg(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && sendChat()}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '12px 14px', borderRadius: 14, border: '2px solid var(--inpB)', background: 'var(--inp)', color: 'var(--txt)', fontSize: 13 }}
          />
          <button onClick={sendChat} className="press" style={{ padding: '12px 18px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Send</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt)', fontFamily: "'Sora',sans-serif", marginBottom: 16 }}>❓ Help & Support</div>
      
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setChatStarted(true)} className="press" style={{ flex: 1, padding: '14px', borderRadius: 14, background: 'linear-gradient(135deg,rgba(255,107,53,.15),rgba(255,61,96,.1))', color: 'var(--acc)', fontWeight: 800, fontSize: 13, textAlign: 'center', border: '1px solid rgba(255,107,53,.2)', cursor: 'pointer' }}>💬 Chat</button>
        <a href="mailto:shahyash1804@gmail.com?subject=QuickBite%20Support%20Request" className="press" style={{ flex: 1, textDecoration: 'none', padding: '14px', borderRadius: 14, background: 'var(--inp)', border: '1px solid var(--bdr)', color: 'var(--txt)', fontWeight: 800, fontSize: 13, textAlign: 'center', cursor: 'pointer' }}>📧 Email</a>
      </div>

      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--txt)', marginBottom: 12 }}>Frequently Asked Questions</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {FAQS.map((faq, i) => (
          <div key={i} onClick={() => toggle(i)} className="glass" style={{ borderRadius: 14, border: `1px solid ${openId === i ? 'rgba(255,107,53,.3)' : 'var(--bdr)'}`, overflow: 'hidden', cursor: 'pointer' }}>
            <div className="press" style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: openId === i ? 'var(--acc)' : 'var(--txt)', paddingRight: 10 }}>{faq.q}</div>
              <div style={{ color: 'var(--mut)', fontWeight: 800, transform: `rotate(${openId === i ? '180deg' : '0'})`, transition: 'transform 0.2s' }}>▼</div>
            </div>
            {openId === i && (
              <div className="anim-fadeUp" style={{ padding: '0 16px 14px', fontSize: 12, lineHeight: 1.5, color: 'var(--sub)' }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <a href="https://shah-yash.github.io/quickbite-marketing/" target="_blank" rel="noreferrer" className="press" style={{ display: 'block', textDecoration: 'none', width: '100%', padding: '14px', borderRadius: 14, border: '2px dashed var(--bdr)', background: 'transparent', color: 'var(--mut)', fontWeight: 700, fontSize: 13, textAlign: 'center', boxSizing: 'border-box', marginBottom: 20, cursor: 'pointer' }}>
        🌐 Visit Full Help Center
      </a>

      <button onClick={close} className="press" style={{ width: '100%', padding: '14px', borderRadius: 16, border: 'none', background: 'var(--inp)', color: 'var(--txt)', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>Close</button>
    </>
  );
};
