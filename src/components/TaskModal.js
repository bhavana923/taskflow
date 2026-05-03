import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

export default function TaskModal({ onClose, defaultStatus }) {
  const { user, allUsers } = useAuth();
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [assignedTo, setAssignedTo] = useState(user.id);
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      description: desc.trim(),
      priority,
      category: category.trim(),
      assignedTo,
      createdBy: user.id,
      dueDate,
      status: defaultStatus || 'todo',
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border-2)',
        borderRadius: 20, padding: 32, width: '100%', maxWidth: 480,
        maxHeight: '90vh', overflowY: 'auto',
        animation: 'scaleIn 0.2s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>New task</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-3)', border: 'none', color: 'var(--text-2)', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Task title *</label>
            <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to be done?" required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Add more details…" style={{ resize: 'vertical', minHeight: 80 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: '10px 14px' }}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Assign to</label>
              <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} style={{ padding: '10px 14px' }}>
                {allUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name}{u.id === user.id ? ' (you)' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Category</label>
              <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Design" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Due date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Tags <span style={{ color: 'var(--text-3)' }}>(comma separated)</span></label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="frontend, bug, feature" />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '11px', borderRadius: 999,
              background: 'var(--bg-3)', color: 'var(--text-2)', fontWeight: 500, fontSize: 14, cursor: 'pointer',
            }}>Cancel</button>
            <button type="submit" style={{
              flex: 2, padding: '11px', borderRadius: 999,
              background: 'var(--lime)', color: '#0a0a0f', fontWeight: 700, fontSize: 14,
            }}>Create task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
