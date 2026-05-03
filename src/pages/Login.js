import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const result = login(email, password);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    navigate('/dashboard');
  };

  const fillDemo = (email) => {
    setEmail(email);
    setPassword('demo123');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }} className="animate-fadeUp">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-2)' }}>Sign in to your TaskFlow account</p>
        </div>

        {/* Demo accounts */}
        <div style={{
          background: 'var(--lime-dim)', border: '1px solid rgba(200,255,87,0.2)',
          borderRadius: 'var(--radius)', padding: 16, marginBottom: 24,
        }}>
          <p style={{ fontSize: 12, color: 'var(--lime)', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Demo accounts (password: demo123)
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { name: 'Aanya', email: 'aanya@taskflow.app', color: '#c8ff57' },
              { name: 'Rohan', email: 'rohan@taskflow.app', color: '#9b7dff' },
              { name: 'Priya', email: 'priya@taskflow.app', color: '#ff7c57' },
            ].map(u => (
              <button key={u.email} onClick={() => fillDemo(u.email)} style={{
                background: 'var(--surface-2)', border: '1px solid var(--border-2)',
                borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 500,
                color: u.color, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: u.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#0a0a0f' }}>
                  {u.name[0]}
                </span>
                {u.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
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
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-2)' }}>
          No account? <Link to="/signup" style={{ color: 'var(--lime)', fontWeight: 600 }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
