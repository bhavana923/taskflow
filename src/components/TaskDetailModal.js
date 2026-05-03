import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

function Avatar({ userId, size = 28 }) {
  const { getUserById } = useAuth();
  const u = getUserById(userId);
  if (!u) return null;
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: u.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: '#0a0a0f', flexShrink: 0,
    }}>{u.avatar}</span>
  );
}

export default function TaskDetailModal({ task, onClose }) {
  const { user, getUserById, allUsers } = useAuth();
  const { updateTask, deleteTask, moveTask, addComment } = useTasks();
  const [comment, setComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editAssigned, setEditAssigned] = useState(task.assignedTo);

  const assignee = getUserById(task.assignedTo);
  const creator = getUserById(task.createdBy);

  const statusOptions = [
    { value: 'todo', label: 'To Do', color: 'var(--text-2)' },
    { value: 'in-progress', label: 'In Progress', color: 'var(--sky)' },
    { value: 'done', label: 'Done', color: 'var(--lime)' },
  ];
  const currentStatus = statusOptions.find(s => s.value === task.status) || statusOptions[0];

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(task.id, user.id, comment.trim());
    setComment('');
  };

  const handleSaveEdit = () => {
    updateTask(task.id, {
      title: editTitle,
      description: editDesc,
      priority: editPriority,
      assignedTo: editAssigned,
    });
    setEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this task?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border-2)',
        borderRadius: 20, width: '100%', maxWidth: 560,
        maxHeight: '90vh', overflowY: 'auto',
        animation: 'scaleIn 0.2s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 28px 0', borderBottom: '1px solid var(--border)', paddingBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            {editing ? (
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ flex: 1, fontSize: 18, fontWeight: 700 }} autoFocus />
            ) : (
              <h2 style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.3, flex: 1 }}>{task.title}</h2>
            )}
            <button onClick={onClose} style={{ background: 'var(--bg-3)', border: 'none', color: 'var(--text-2)', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>✕</button>
          </div>

          {/* Status selector */}
          <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
            {statusOptions.map(s => (
              <button key={s.value} onClick={() => moveTask(task.id, s.value)} style={{
                padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: task.status === s.value ? (s.value === 'done' ? 'var(--lime-dim)' : s.value === 'in-progress' ? 'var(--sky-dim)' : 'var(--surface-2)') : 'transparent',
                color: task.status === s.value ? s.color : 'var(--text-3)',
                border: `1px solid ${task.status === s.value ? s.color + '44' : 'var(--border)'}`,
              }}>{s.label}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Description */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Description</div>
            {editing ? (
              <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ minHeight: 80, resize: 'vertical' }} placeholder="Add a description…" />
            ) : (
              <p style={{ color: task.description ? 'var(--text-1)' : 'var(--text-3)', fontSize: 14, lineHeight: 1.6 }}>
                {task.description || 'No description'}
              </p>
            )}
          </div>

          {/* Meta info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <MetaItem label="Priority">
              {editing ? (
                <select value={editPriority} onChange={e => setEditPriority(e.target.value)} style={{ padding: '4px 8px', fontSize: 13 }}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <span className={`badge badge-${task.priority === 'high' ? 'coral' : task.priority === 'medium' ? 'sky' : 'violet'}`}>{task.priority}</span>
              )}
            </MetaItem>

            <MetaItem label="Assigned to">
              {editing ? (
                <select value={editAssigned} onChange={e => setEditAssigned(e.target.value)} style={{ padding: '4px 8px', fontSize: 13 }}>
                  {allUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Avatar userId={task.assignedTo} size={20} />
                  <span style={{ fontSize: 13 }}>{assignee?.name || 'Unassigned'}</span>
                </div>
              )}
            </MetaItem>

            <MetaItem label="Created by">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Avatar userId={task.createdBy} size={20} />
                <span style={{ fontSize: 13 }}>{creator?.name || 'Unknown'}</span>
              </div>
            </MetaItem>

            {task.dueDate && (
              <MetaItem label="Due date"><span style={{ fontSize: 13 }}>{task.dueDate}</span></MetaItem>
            )}

            {task.category && (
              <MetaItem label="Category"><span style={{ fontSize: 13 }}>{task.category}</span></MetaItem>
            )}

            {task.tags?.length > 0 && (
              <MetaItem label="Tags">
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {task.tags.map(t => (
                    <span key={t} style={{ fontSize: 11, color: 'var(--violet)', background: 'var(--violet-dim)', padding: '2px 8px', borderRadius: 999 }}>{t}</span>
                  ))}
                </div>
              </MetaItem>
            )}
          </div>

          {/* Edit controls */}
          {editing ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '9px', borderRadius: 999, background: 'var(--bg-3)', color: 'var(--text-2)', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              <button onClick={handleSaveEdit} style={{ flex: 2, padding: '9px', borderRadius: 999, background: 'var(--lime)', color: '#0a0a0f', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Save changes</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEditing(true)} style={{ flex: 1, padding: '9px', borderRadius: 999, background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border-2)', cursor: 'pointer', fontSize: 13 }}>Edit task</button>
              <button onClick={handleDelete} style={{ padding: '9px 16px', borderRadius: 999, background: 'var(--coral-dim)', color: 'var(--coral)', border: '1px solid rgba(255,124,87,0.2)', cursor: 'pointer', fontSize: 13 }}>Delete</button>
            </div>
          )}

          {/* Comments */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Comments ({task.comments?.length || 0})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
              {(task.comments || []).map(c => {
                const commentUser = getUserById(c.userId);
                return (
                  <div key={c.id} style={{ display: 'flex', gap: 10 }}>
                    <Avatar userId={c.userId} size={28} />
                    <div style={{ flex: 1, background: 'var(--bg-3)', borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: commentUser?.color || 'var(--text-2)', marginBottom: 4 }}>
                        {commentUser?.name || 'Unknown'}
                        <span style={{ fontWeight: 400, color: 'var(--text-3)', marginLeft: 8 }}>
                          {new Date(c.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.5 }}>{c.text}</p>
                    </div>
                  </div>
                );
              })}
              {(!task.comments || task.comments.length === 0) && (
                <p style={{ color: 'var(--text-3)', fontSize: 13 }}>No comments yet. Be the first!</p>
              )}
            </div>

            <form onSubmit={handleComment} style={{ display: 'flex', gap: 8 }}>
              <Avatar userId={user.id} size={28} />
              <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment…" style={{ flex: 1, padding: '8px 14px' }} />
              <button type="submit" disabled={!comment.trim()} style={{
                background: 'var(--lime)', color: '#0a0a0f', fontWeight: 700, fontSize: 13,
                padding: '8px 16px', borderRadius: 8, flexShrink: 0,
              }}>Post</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}
