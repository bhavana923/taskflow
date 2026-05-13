import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      padding: '6px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500,
      color: active ? 'var(--lime)' : 'var(--text-2)',
      background: active ? 'var(--lime-dim)' : 'transparent',
      transition: 'all 0.2s',
    }}>{children}</Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <Link to={user ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#0a0a0f"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="#0a0a0f" opacity="0.4"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="#0a0a0f" opacity="0.4"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#0a0a0f"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--text-1)' }}>TaskFlow</span>
        </Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
            <NavLink to="/board" active={isActive('/board')}>Board</NavLink>
            <NavLink to="/teams" active={isActive('/teams')}>Teams</NavLink>
            <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 6px' }} />
            <div style={{ position: 'relative' }}>
              <button onClick={() => setMenuOpen(o => !o)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--surface)', border: '1px solid var(--border-2)',
                borderRadius: 999, padding: '5px 12px 5px 6px', cursor: 'pointer',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: user.color || 'var(--lime)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: '#0a0a0f',
                }}>{user.avatar}</div>
                <span style={{ color: 'var(--text-1)', fontSize: 13, fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
              </button>
              {menuOpen && (
                <>
                  <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: 'var(--surface-2)', border: '1px solid var(--border-2)',
                    borderRadius: 12, minWidth: 180, overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 20,
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{user.email}</div>
                    </div>
                    <button onClick={handleLogout} style={{
                      width: '100%', textAlign: 'left', padding: '10px 16px',
                      background: 'transparent', color: 'var(--coral)', fontSize: 13, cursor: 'pointer',
                    }}>Sign out</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/login" style={{ color: 'var(--text-2)', fontSize: 14, fontWeight: 500, padding: '7px 16px' }}>Sign in</Link>
            <Link to="/signup" style={{ background: 'var(--lime)', color: '#0a0a0f', fontWeight: 700, fontSize: 14, padding: '7px 18px', borderRadius: 999 }}>Get started →</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
