import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const result = signup(name, email, password);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }} className="animate-fadeUp">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Create account</h1>
          <p style={{ color: 'var(--text-2)' }}>Join TaskFlow and start collaborating</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Full name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required minLength={6} />
          </div>

          {error && (
            <div style={{ background: 'var(--coral-dim)', border: '1px solid rgba(255,124,87,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--coral)' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            background: 'var(--lime)', color: '#0a0a0f',
            fontWeight: 700, fontSize: 15, padding: '13px',
            borderRadius: 999, marginTop: 4,
          }}>
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-2)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--lime)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
