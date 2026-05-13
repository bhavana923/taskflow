import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useTeams } from '../context/TeamsContext';
import TaskModal from '../components/TaskModal';
import TaskDetailModal from '../components/TaskDetailModal';

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'var(--text-2)', accent: 'rgba(255,255,255,0.06)' },
  { id: 'in-progress', label: 'In Progress', color: 'var(--sky)', accent: 'var(--sky-dim)' },
  { id: 'done', label: 'Done', color: 'var(--lime)', accent: 'var(--lime-dim)' },
];

function Avatar({ userId, size = 22 }) {
  const { getUserById } = useAuth();
  const u = getUserById(userId);
  if (!u) return null;
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: u.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, color: '#0a0a0f', flexShrink: 0,
    }} title={u.name}>{u.avatar}</span>
  );
}

function TaskCard({ task, onClick }) {
  const [dragging, setDragging] = useState(false);
  const priorityColor = { high: 'var(--coral)', medium: 'var(--sky)', low: 'var(--text-3)' };

  return (
    <div
      draggable
      onDragStart={e => { setDragging(true); e.dataTransfer.setData('taskId', task.id); }}
      onDragEnd={() => setDragging(false)}
      onClick={() => onClick(task)}
      style={{
        background: dragging ? 'var(--bg-3)' : 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 12, padding: '14px 16px',
        cursor: 'grab', opacity: dragging ? 0.5 : 1,
        transition: 'transform 0.15s, border-color 0.15s',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{
          width: 3, height: 28, borderRadius: 999,
          background: priorityColor[task.priority] || 'var(--text-3)',
          display: 'inline-block', flexShrink: 0,
        }} />
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {task.comments?.length > 0 && (
            <span style={{ fontSize: 10, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}>
              💬 {task.comments.length}
            </span>
          )}
          <Avatar userId={task.assignedTo} />
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, lineHeight: 1.4, color: 'var(--text-1)' }}>
        {task.title}
      </div>

      {task.description && (
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {task.category && (
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', background: 'var(--bg-3)', padding: '2px 8px', borderRadius: 999 }}>
            {task.category}
          </span>
        )}
        {task.tags?.slice(0, 2).map(tag => (
          <span key={tag} style={{ fontSize: 10, color: 'var(--violet)', background: 'var(--violet-dim)', padding: '2px 8px', borderRadius: 999 }}>
            {tag}
          </span>
        ))}
        {task.dueDate && (
          <span style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 'auto' }}>
            📅 {task.dueDate}
          </span>
        )}
      </div>
    </div>
  );
}

export default function TeamBoard() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { tasks, moveTask } = useTasks();
  const { teams, removeTaskFromTeam } = useTeams();
  const { allUsers } = useAuth();

  const team = teams.find(t => t.id === teamId);

  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterMember, setFilterMember] = useState('all');

  if (!team) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p style={{ color: 'var(--text-3)', marginBottom: 16 }}>Team not found.</p>
        <Link to="/teams" style={{ color: 'var(--lime)' }}>← Back to Teams</Link>
      </div>
    );
  }

  const teamTasks = tasks.filter(t => (team.taskIds || []).includes(t.id));
  const members = allUsers.filter(u => team.memberIds.includes(u.id));

  const filtered = teamTasks.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchMember = filterMember === 'all' || t.assignedTo === filterMember;
    return matchSearch && matchPriority && matchMember;
  });

  const getColumnTasks = (colId) => filtered.filter(t => t.status === colId);

  const handleDrop = (e, colId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) moveTask(taskId, colId);
    setDragOver(null);
  };

  const done = teamTasks.filter(t => t.status === 'done').length;
  const completion = teamTasks.length > 0 ? Math.round((done / teamTasks.length) * 100) : 0;

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Back + Header */}
      <div style={{ marginBottom: 28 }}>
        <Link to="/teams" style={{ fontSize: 13, color: 'var(--text-3)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16, textDecoration: 'none' }}>
          ← Back to Teams
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: team.color, flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>{team.name}</h1>
              {team.description && <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>{team.description}</p>}
            </div>
          </div>
          <button onClick={() => setShowCreate(true)} style={{
            background: team.color, color: '#0a0a0f',
            fontWeight: 700, fontSize: 14, padding: '9px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
          }}>+ New task</button>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'Total tasks', value: teamTasks.length },
            { label: 'In progress', value: teamTasks.filter(t => t.status === 'in-progress').length, color: 'var(--sky)' },
            { label: 'Done', value: done, color: 'var(--lime)' },
            { label: 'Completion', value: `${completion}%`, color: completion > 60 ? 'var(--lime)' : 'var(--text-2)' },
          ].map(s => (
            <div key={s.label} style={{ fontSize: 13, color: 'var(--text-3)' }}>
              {s.label}: <span style={{ fontWeight: 700, color: s.color || 'var(--text-1)' }}>{s.value}</span>
            </div>
          ))}
          {/* Member avatars */}
          <div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center', gap: 4 }}>
            {members.map((m, i) => (
              <div key={m.id} title={m.name} style={{
                width: 26, height: 26, borderRadius: '50%',
                background: m.color, border: '2px solid var(--bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 800, color: '#0a0a0f',
                marginLeft: i > 0 ? -6 : 0,
              }}>{m.avatar}</div>
            ))}
            <span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 6 }}>{members.length} members</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search tasks…"
          style={{ width: 200, padding: '8px 14px', fontSize: 13 }}
        />
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ padding: '8px 14px', fontSize: 13, width: 'auto' }}>
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select value={filterMember} onChange={e => setFilterMember(e.target.value)} style={{ padding: '8px 14px', fontSize: 13, width: 'auto' }}>
          <option value="all">All members</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {/* Board */}
      {teamTasks.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 20px',
          background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
          border: '1px dashed var(--border-2)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No tasks yet</h3>
          <p style={{ color: 'var(--text-3)', marginBottom: 24 }}>Create a task or assign existing tasks to this team.</p>
          <button onClick={() => setShowCreate(true)} style={{
            background: team.color, color: '#0a0a0f', fontWeight: 700,
            padding: '10px 24px', borderRadius: 999, border: 'none', cursor: 'pointer',
          }}>+ New task</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'start' }}>
          {COLUMNS.map(col => {
            const colTasks = getColumnTasks(col.id);
            return (
              <div
                key={col.id}
                onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => handleDrop(e, col.id)}
                style={{
                  background: dragOver === col.id ? col.accent : 'var(--bg-2)',
                  border: `1px solid ${dragOver === col.id ? col.color : 'var(--border)'}`,
                  borderRadius: 16, padding: 14,
                  minHeight: 400, transition: 'background 0.15s, border-color 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: '0 4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: col.color }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: col.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{col.label}</span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: col.color,
                    background: col.accent, padding: '2px 8px', borderRadius: 999,
                  }}>{colTasks.length}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {colTasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={setSelectedTask} />
                  ))}
                  {colTasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-3)', fontSize: 13 }}>
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <TaskModal
          onClose={() => setShowCreate(false)}
          defaultTeamId={team.id}
        />
      )}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
