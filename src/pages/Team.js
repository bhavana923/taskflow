import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

export default function Team() {
  const { allUsers, user } = useAuth();
  const { tasks } = useTasks();

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>Team</h1>
        <p style={{ color: 'var(--text-2)' }}>{allUsers.length} members collaborating on TaskFlow</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {allUsers.map(u => {
          const userTasks = tasks.filter(t => t.assignedTo === u.id);
          const done = userTasks.filter(t => t.status === 'done').length;
          const inProgress = userTasks.filter(t => t.status === 'in-progress').length;
          const todo = userTasks.filter(t => t.status === 'todo').length;
          const completionRate = userTasks.length > 0 ? Math.round((done / userTasks.length) * 100) : 0;
          const highPriority = userTasks.filter(t => t.priority === 'high' && t.status !== 'done').length;

          return (
            <div key={u.id} style={{
              background: 'var(--surface)', border: `1px solid ${u.id === user.id ? 'rgba(200,255,87,0.3)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)', padding: 24, position: 'relative',
            }}>
              {u.id === user.id && (
                <span style={{
                  position: 'absolute', top: 14, right: 14,
                  fontSize: 10, fontWeight: 700, color: 'var(--lime)',
                  background: 'var(--lime-dim)', padding: '2px 8px', borderRadius: 999,
                }}>YOU</span>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 800, color: '#0a0a0f',
                }}>{u.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{u.email}</div>
                </div>
              </div>

              {/* Task breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'To Do', value: todo, color: 'var(--text-2)' },
                  { label: 'Doing', value: inProgress, color: 'var(--sky)' },
                  { label: 'Done', value: done, color: 'var(--lime)' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg-3)', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Completion bar */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Completion rate</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: completionRate > 60 ? 'var(--lime)' : 'var(--text-2)' }}>{completionRate}%</span>
                </div>
                <div style={{ background: 'var(--bg-3)', borderRadius: 999, height: 6 }}>
                  <div style={{
                    height: '100%', borderRadius: 999,
                    background: completionRate > 60 ? 'var(--lime)' : completionRate > 30 ? 'var(--sky)' : 'var(--coral)',
                    width: `${completionRate}%`, transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>

              {highPriority > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--coral)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--coral)' }} />
                  {highPriority} high priority task{highPriority !== 1 ? 's' : ''} pending
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
