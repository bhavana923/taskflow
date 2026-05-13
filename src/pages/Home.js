import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: '⚡',
    title: 'Real-time collaboration',
    desc: 'Multiple users can work on tasks simultaneously with live updates across the board.',
    color: 'var(--lime)',
    bg: 'var(--lime-dim)',
  },
  {
    icon: '🎯',
    title: 'Kanban board',
    desc: 'Drag tasks across To Do, In Progress, and Done columns to track workflow visually.',
    color: 'var(--violet)',
    bg: 'var(--violet-dim)',
  },
  {
    icon: '💬',
    title: 'Task comments',
    desc: 'Leave comments on tasks to communicate context and updates with your team.',
    color: 'var(--sky)',
    bg: 'var(--sky-dim)',
  },
  {
    icon: '📊',
    title: 'Progress dashboard',
    desc: 'Get a bird-eye view of all tasks, priorities, and team workload at a glance.',
    color: 'var(--coral)',
    bg: 'var(--coral-dim)',
  },
  {
    icon: '🏷️',
    title: 'Tags & categories',
    desc: 'Organize tasks with custom tags, categories, and priority levels.',
    color: 'var(--lime)',
    bg: 'var(--lime-dim)',
  },
  {
    icon: '👥',
    title: 'Team management',
    desc: 'Assign tasks to teammates, track workloads and see who\'s working on what.',
    color: 'var(--violet)',
    bg: 'var(--violet-dim)',
  },
];

const stats = [
  { value: '3+', label: 'Team members' },
  { value: '100%', label: 'Free to use' },
  { value: '∞', label: 'Tasks supported' },
  { value: 'OSS', label: 'Open source' },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '100px 0 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(200,255,87,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container animate-fadeUp">
          <div style={{ marginBottom: 20 }}>
            <span className="badge badge-lime">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lime)', display: 'inline-block' }} />
              ✦ COLLABORATE · TRACK · DELIVER
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(42px, 8vw, 80px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: 24,
            color: 'var(--text-1)',
          }}>
            Tasks, done{' '}
            <span style={{
              color: 'var(--lime)',
              display: 'inline-block',
            }}>
              together.
            </span>
          </h1>

          <p style={{
            fontSize: 18, color: 'var(--text-2)', maxWidth: 520, margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            A multi-user task management app. Create tasks, assign them to teammates,
            track progress on a Kanban board, and ship faster as a team.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              background: 'var(--lime)', color: '#0a0a0f',
              fontWeight: 700, fontSize: 16, padding: '13px 28px',
              borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'transform 0.2s, opacity 0.2s',
            }}>
              Start for free →
            </Link>
            <Link to="/login" style={{
              background: 'var(--surface)', color: 'var(--text-1)',
              fontWeight: 500, fontSize: 15, padding: '13px 28px',
              borderRadius: 999, border: '1px solid var(--border-2)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Try demo account
            </Link>
          </div>

          <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-3)' }}>
          Try Demo
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="container" style={{ marginBottom: 80 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '28px 20px', textAlign: 'center',
              borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--lime)' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="container" style={{ marginBottom: 100 }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="badge badge-violet" style={{ marginBottom: 16 }}>Features</span>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Everything your team needs
          </h2>
          <p style={{ color: 'var(--text-2)', marginTop: 12, maxWidth: 440, margin: '12px auto 0' }}>
          Built To Create
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '28px',
              transition: 'border-color 0.2s, transform 0.2s',
              animationDelay: `${i * 0.07}s`,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, marginBottom: 16,
              }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* App preview mockup */}
      <section className="container" style={{ marginBottom: 100 }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border-2)',
          borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        }}>
          {/* Window chrome */}
          <div style={{
            padding: '14px 20px', background: 'var(--bg-2)',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
            <div style={{
              flex: 1, textAlign: 'center', fontSize: 12, color: 'var(--text-3)',
              background: 'var(--bg-3)', borderRadius: 6, padding: '3px 0', maxWidth: 300, margin: '0 auto',
            }}>
              taskflow.vercel.app/board
            </div>
          </div>

          {/* Board preview */}
          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'To Do', color: 'var(--text-3)', tasks: ['Write unit tests', 'Deploy to Vercel', 'User testing sessions'] },
              { label: 'In Progress', color: 'var(--sky)', tasks: ['Set up authentication'] },
              { label: 'Done', color: 'var(--lime)', tasks: ['Design homepage', 'Set up project'] },
            ].map((col, ci) => (
              <div key={ci}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: col.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{col.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 'auto' }}>{col.tasks.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {col.tasks.map((task, ti) => (
                    <div key={ti} style={{
                      background: 'var(--bg-3)', border: '1px solid var(--border)',
                      borderRadius: 10, padding: '12px 14px',
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{task}</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: ['var(--lime)', 'var(--violet)', 'var(--coral)'][ti % 3], fontSize: 8, fontWeight: 700, color: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {['AS', 'RM', 'PN'][ti % 3]}
                        </div>
                        <span className={`badge badge-${['lime', 'sky', 'coral'][ci]}`} style={{ fontSize: 9 }}>
                          {['high', 'medium', 'low'][ti % 3]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, var(--surface) 0%, var(--bg-3) 100%)',
            border: '1px solid var(--border-2)', borderRadius: 'var(--radius-xl)',
            padding: '60px 40px',
          }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>
              Ready to get organized?
            </h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 32, fontSize: 16 }}>
              Sign up free and start collaborating with your team today.
            </p>
            <Link to="/signup" style={{
              background: 'var(--lime)', color: '#0a0a0f',
              fontWeight: 700, fontSize: 16, padding: '14px 32px',
              borderRadius: 999, display: 'inline-block',
            }}>
              Create your account →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
          TaskFlow For The Best Teams
        </div>
      </footer>
    </div>
  );
}
