import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import TaskModal from '../components/TaskModal';

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '24px',
    }}>
      <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 8, fontWeight: 500 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, color: color || 'var(--text-1)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>{sub}</div>}
    </div>
  );
}

function PriorityDot({ priority }) {
  const colors = { high: 'var(--coral)', medium: 'var(--sky)', low: 'var(--text-3)' };
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[priority] || 'var(--text-3)', display: 'inline-block' }} />;
}

function Avatar({ userId }) {
  const { getUserById } = useAuth();
  const u = getUserById(userId);
  if (!u) return null;
  return (
    <span style={{
      width: 22, height: 22, borderRadius: '50%',
      background: u.color || 'var(--lime)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontWeight: 700, color: '#0a0a0f',
    }} title={u.name}>{u.avatar}</span>
  );
}

export default function Dashboard() {
  const { user, allUsers } = useAuth();
  const { tasks, getStats } = useTasks();
  const stats = getStats();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const myTasks = tasks.filter(t => t.assignedTo === user.id);
  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

  const displayTasks = filter === 'mine' ? myTasks : recentTasks;

  const statusLabel = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };
  const statusColor = { todo: 'var(--text-3)', 'in-progress': 'var(--sky)', done: 'var(--lime)' };

  const progress = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 4 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user.name.split(' ')[0]} 👋
          </h1>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          background: 'var(--lime)', color: '#0a0a0f',
          fontWeight: 700, fontSize: 14, padding: '10px 20px',
          borderRadius: 999, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New task
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 40 }}>
        <StatCard label="Total tasks" value={stats.total} />
        <StatCard label="Completed" value={stats.done} color="var(--lime)" sub={`${progress}% done`} />
        <StatCard label="In progress" value={stats.inProgress} color="var(--sky)" />
        <StatCard label="High priority" value={stats.high} color="var(--coral)" />
      </div>

      {/* Progress bar */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 40,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Overall progress</span>
          <span style={{ fontSize: 14, color: 'var(--lime)', fontWeight: 700 }}>{progress}%</span>
        </div>
        <div style={{ background: 'var(--bg-3)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 999,
            background: 'linear-gradient(90deg, var(--lime), var(--sky))',
            width: `${progress}%`,
            transition: 'width 0.6s ease',
          }} />
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
          {[
            { label: 'To Do', val: stats.todo, color: 'var(--text-3)' },
            { label: 'In Progress', val: stats.inProgress, color: 'var(--sky)' },
            { label: 'Done', val: stats.done, color: 'var(--lime)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
              <span style={{ color: 'var(--text-3)' }}>{s.label}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks list */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Tasks</h2>
            <div style={{ display: 'flex', gap: 4 }}>
              {['all', 'mine'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '5px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  background: filter === f ? 'var(--lime-dim)' : 'transparent',
                  color: filter === f ? 'var(--lime)' : 'var(--text-2)',
                  border: filter === f ? '1px solid rgba(200,255,87,0.2)' : '1px solid transparent',
                }}>
                  {f === 'all' ? 'All tasks' : 'My tasks'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {displayTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)', background: 'var(--surface)', borderRadius: 'var(--radius)' }}>
                No tasks yet. <button onClick={() => setShowModal(true)} style={{ background: 'none', color: 'var(--lime)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Create one →</button>
              </div>
            ) : displayTasks.map(t => (
              <div key={t.id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'border-color 0.2s',
              }}>
                <PriorityDot priority={t.priority} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{t.title}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className={`badge badge-${t.priority === 'high' ? 'coral' : t.priority === 'medium' ? 'sky' : 'violet'}`}>{t.priority}</span>
                    {t.category && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.category}</span>}
                    {t.dueDate && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Due {t.dueDate}</span>}
                  </div>
                </div>
                <Avatar userId={t.assignedTo} />
                <span style={{
                  fontSize: 11, fontWeight: 600, color: statusColor[t.status],
                  background: t.status === 'done' ? 'var(--lime-dim)' : t.status === 'in-progress' ? 'var(--sky-dim)' : 'rgba(255,255,255,0.04)',
                  padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap',
                }}>
                  {statusLabel[t.status]}
                </span>
              </div>
            ))}
          </div>

          {tasks.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link to="/board" style={{ fontSize: 13, color: 'var(--lime)', fontWeight: 600 }}>
                View Kanban board →
              </Link>
            </div>
          )}
        </div>

        {/* Team sidebar */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Team members</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {allUsers.map(u => {
              const count = tasks.filter(t => t.assignedTo === u.id && t.status !== 'done').length;
              return (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#0a0a0f', flexShrink: 0,
                  }}>{u.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {u.name}
                      {u.id === user.id && <span style={{ fontSize: 10, color: 'var(--lime)', fontWeight: 600 }}>you</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{count} active tasks</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showModal && <TaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
