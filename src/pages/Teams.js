import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTeams } from '../context/TeamsContext';
import { useTasks } from '../context/TaskContext';

const TEAM_COLORS = ['#c8ff57', '#9b7dff', '#ff7c57', '#57c8ff', '#ff57c8', '#57ffb8'];

function Avatar({ u, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 800, color: '#0a0a0f', flexShrink: 0,
    }}>{u.avatar}</div>
  );
}

function Modal({ children, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)', zIndex: 200,
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: 'var(--surface-2)', border: '1px solid var(--border-2)',
        borderRadius: 'var(--radius-xl)', padding: 32, zIndex: 201,
        width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        {children}
      </div>
    </>
  );
}

function CreateTeamModal({ onClose, currentUserId }) {
  const { createTeam } = useTeams();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [color, setColor] = useState(TEAM_COLORS[0]);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) { setError('Team name is required.'); return; }
    createTeam(name, desc, color, currentUserId);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Create new team</h2>
        <p style={{ color: 'var(--text-3)', fontSize: 14 }}>You'll be added as the first member automatically.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
            Team name *
          </label>
          <input
            autoFocus
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            placeholder="e.g. Frontend Team"
            style={{
              width: '100%', background: 'var(--bg-3)', border: `1px solid ${error ? 'var(--coral)' : 'var(--border)'}`,
              borderRadius: 10, padding: '10px 14px', color: 'var(--text-1)', fontSize: 14,
              boxSizing: 'border-box',
            }}
          />
          {error && <p style={{ color: 'var(--coral)', fontSize: 12, marginTop: 4 }}>{error}</p>}
        </div>

        <div>
          <label style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
            Description
          </label>
          <input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="What does this team work on?"
            style={{
              width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '10px 14px', color: 'var(--text-1)', fontSize: 14,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
            Team color
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            {TEAM_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 32, height: 32, borderRadius: '50%', background: c,
                  border: color === c ? '3px solid var(--text-1)' : '3px solid transparent',
                  cursor: 'pointer', transition: 'border 0.15s',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 28, justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{
          padding: '10px 20px', borderRadius: 999, border: '1px solid var(--border-2)',
          background: 'transparent', color: 'var(--text-2)', cursor: 'pointer', fontSize: 14,
        }}>Cancel</button>
        <button onClick={handleSubmit} style={{
          padding: '10px 24px', borderRadius: 999, background: color,
          color: '#0a0a0f', fontWeight: 700, cursor: 'pointer', fontSize: 14, border: 'none',
        }}>Create team</button>
      </div>
    </Modal>
  );
}

function ManageMembersModal({ team, onClose }) {
  const { allUsers } = useAuth();
  const { addMember, removeMember } = useTeams();
  const [search, setSearch] = useState('');

  const members = allUsers.filter(u => team.memberIds.includes(u.id));
  const nonMembers = allUsers.filter(u =>
    !team.memberIds.includes(u.id) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Modal onClose={onClose}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: team.color, flexShrink: 0 }} />
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Manage members</h2>
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: 14, paddingLeft: 24 }}>{team.name}</p>
      </div>

      {/* Current members */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          Current members · {members.length}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {members.map(u => (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--bg-3)', borderRadius: 10, padding: '10px 14px',
            }}>
              <Avatar u={u} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{u.email}</div>
              </div>
              <button
                onClick={() => removeMember(team.id, u.id)}
                style={{
                  padding: '5px 12px', borderRadius: 999, border: '1px solid var(--coral)',
                  background: 'transparent', color: 'var(--coral)', fontSize: 12,
                  cursor: 'pointer', fontWeight: 600,
                }}>Remove</button>
            </div>
          ))}
          {members.length === 0 && (
            <p style={{ color: 'var(--text-3)', fontSize: 13, padding: '8px 0' }}>No members yet.</p>
          )}
        </div>
      </div>

      {/* Add members */}
      <div>
        <p style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          Add members
        </p>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          style={{
            width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '9px 14px', color: 'var(--text-1)', fontSize: 14,
            marginBottom: 10, boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {nonMembers.map(u => (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--bg-3)', borderRadius: 10, padding: '10px 14px',
            }}>
              <Avatar u={u} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{u.email}</div>
              </div>
              <button
                onClick={() => addMember(team.id, u.id)}
                style={{
                  padding: '5px 14px', borderRadius: 999,
                  background: team.color, color: '#0a0a0f',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
                }}>+ Add</button>
            </div>
          ))}
          {nonMembers.length === 0 && !search && allUsers.length === members.length && (
            <p style={{ color: 'var(--text-3)', fontSize: 13, padding: '8px 0' }}>All users are already in this team.</p>
          )}
          {nonMembers.length === 0 && search && (
            <p style={{ color: 'var(--text-3)', fontSize: 13, padding: '8px 0' }}>No users match "{search}".</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{
          padding: '10px 24px', borderRadius: 999,
          background: 'var(--surface)', border: '1px solid var(--border-2)',
          color: 'var(--text-1)', fontWeight: 600, cursor: 'pointer', fontSize: 14,
        }}>Done</button>
      </div>
    </Modal>
  );
}

export default function Teams() {
  const { allUsers, user } = useAuth();
  const { teams, deleteTeam } = useTeams();
  const { tasks } = useTasks();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [managingTeam, setManagingTeam] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [view, setView] = useState('teams'); // 'teams' | 'members'

  const handleDelete = (teamId) => {
    deleteTeam(teamId);
    setConfirmDelete(null);
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>Teams</h1>
          <p style={{ color: 'var(--text-2)' }}>
            {teams.length} team{teams.length !== 1 ? 's' : ''} · {allUsers.length} total members
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{
            display: 'flex', background: 'var(--bg-3)', borderRadius: 999,
            border: '1px solid var(--border)', padding: 3, gap: 2,
          }}>
            {['teams', 'members'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '5px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                background: view === v ? 'var(--surface)' : 'transparent',
                color: view === v ? 'var(--text-1)' : 'var(--text-3)',
                border: 'none', cursor: 'pointer', textTransform: 'capitalize',
                transition: 'all 0.15s',
              }}>{v}</button>
            ))}
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: 'var(--lime)', color: '#0a0a0f', fontWeight: 700,
              fontSize: 14, padding: '9px 20px', borderRadius: 999, border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}>
            + New team
          </button>
        </div>
      </div>

      {/* Teams view */}
      {view === 'teams' && (
        <>
          {teams.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px 20px',
              background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
              border: '1px dashed var(--border-2)',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No teams yet</h3>
              <p style={{ color: 'var(--text-3)', marginBottom: 24 }}>Create your first team to start collaborating.</p>
              <button onClick={() => setShowCreateModal(true)} style={{
                background: 'var(--lime)', color: '#0a0a0f', fontWeight: 700,
                padding: '10px 24px', borderRadius: 999, border: 'none', cursor: 'pointer',
              }}>Create a team</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {teams.map(team => {
                const members = allUsers.filter(u => team.memberIds.includes(u.id));
                const teamTasks = tasks.filter(t => members.some(m => m.id === t.assignedTo));
                const done = teamTasks.filter(t => t.status === 'done').length;
                const completion = teamTasks.length > 0 ? Math.round((done / teamTasks.length) * 100) : 0;
                const isOwner = team.createdBy === user.id;

                return (
                  <div key={team.id} style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-xl)', padding: 24, position: 'relative',
                    transition: 'border-color 0.2s',
                  }}>
                    {/* Color bar */}
                    <div style={{
                      position: 'absolute', top: 0, left: 24, right: 24, height: 3,
                      background: team.color, borderRadius: '0 0 999px 999px',
                    }} />

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, marginTop: 8 }}>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{team.name}</h3>
                        {team.description && (
                          <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>{team.description}</p>
                        )}
                      </div>
                      {isOwner && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: team.color,
                          background: `${team.color}22`, padding: '2px 8px', borderRadius: 999,
                          flexShrink: 0, marginLeft: 8,
                        }}>OWNER</span>
                      )}
                    </div>

                    {/* Member avatars */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                      <div style={{ display: 'flex' }}>
                        {members.slice(0, 5).map((m, i) => (
                          <div key={m.id} title={m.name} style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: m.color, border: '2px solid var(--surface)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 800, color: '#0a0a0f',
                            marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i, position: 'relative',
                          }}>{m.avatar}</div>
                        ))}
                        {members.length > 5 && (
                          <div style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: 'var(--bg-3)', border: '2px solid var(--surface)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 700, color: 'var(--text-2)',
                            marginLeft: -8, position: 'relative',
                          }}>+{members.length - 5}</div>
                        )}
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--text-3)', marginLeft: 4 }}>
                        {members.length} member{members.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Task stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
                      {[
                        { label: 'Total', value: teamTasks.length, color: 'var(--text-1)' },
                        { label: 'Active', value: teamTasks.filter(t => t.status !== 'done').length, color: 'var(--sky)' },
                        { label: 'Done', value: done, color: 'var(--lime)' },
                      ].map(s => (
                        <div key={s.label} style={{
                          background: 'var(--bg-3)', borderRadius: 8, padding: '8px',
                          textAlign: 'center',
                        }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Completion bar */}
                    {teamTasks.length > 0 && (
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Team completion</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: completion > 60 ? 'var(--lime)' : 'var(--text-2)' }}>{completion}%</span>
                        </div>
                        <div style={{ background: 'var(--bg-3)', borderRadius: 999, height: 5 }}>
                          <div style={{
                            height: '100%', borderRadius: 999, width: `${completion}%`,
                            background: team.color, transition: 'width 0.5s ease',
                          }} />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setManagingTeam(team)}
                        style={{
                          flex: 1, padding: '8px 0', borderRadius: 10,
                          background: `${team.color}18`, border: `1px solid ${team.color}44`,
                          color: team.color, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                        }}>
                        Manage members
                      </button>
                      {isOwner && (
                        <button
                          onClick={() => setConfirmDelete(team)}
                          style={{
                            padding: '8px 14px', borderRadius: 10,
                            background: 'transparent', border: '1px solid var(--border-2)',
                            color: 'var(--text-3)', fontSize: 13, cursor: 'pointer',
                          }}>🗑</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* All members view */}
      {view === 'members' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {allUsers.map(u => {
            const userTasks = tasks.filter(t => t.assignedTo === u.id);
            const done = userTasks.filter(t => t.status === 'done').length;
            const inProgress = userTasks.filter(t => t.status === 'in-progress').length;
            const todo = userTasks.filter(t => t.status === 'todo').length;
            const completionRate = userTasks.length > 0 ? Math.round((done / userTasks.length) * 100) : 0;
            const highPriority = userTasks.filter(t => t.priority === 'high' && t.status !== 'done').length;
            const memberTeams = teams.filter(t => t.memberIds.includes(u.id));

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

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <Avatar u={u} size={50} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{u.email}</div>
                  </div>
                </div>

                {/* Teams badges */}
                {memberTeams.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
                    {memberTeams.map(t => (
                      <span key={t.id} style={{
                        fontSize: 10, fontWeight: 700, color: t.color,
                        background: `${t.color}18`, padding: '2px 8px',
                        borderRadius: 999, border: `1px solid ${t.color}33`,
                      }}>{t.name}</span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
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

                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
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
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          currentUserId={user.id}
        />
      )}

      {managingTeam && (
        <ManageMembersModal
          team={managingTeam}
          onClose={() => setManagingTeam(null)}
        />
      )}

      {confirmDelete && (
        <Modal onClose={() => setConfirmDelete(null)}>
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Delete "{confirmDelete.name}"?</h2>
            <p style={{ color: 'var(--text-3)', marginBottom: 28, fontSize: 14 }}>
              This will permanently remove the team. Tasks won't be affected.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setConfirmDelete(null)} style={{
                padding: '10px 24px', borderRadius: 999, border: '1px solid var(--border-2)',
                background: 'transparent', color: 'var(--text-2)', cursor: 'pointer', fontSize: 14,
              }}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete.id)} style={{
                padding: '10px 24px', borderRadius: 999, background: 'var(--coral)',
                color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14, border: 'none',
              }}>Delete team</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
