import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TeamsContext = createContext(null);

const DEMO_TEAMS = [
  {
    id: 'team1',
    name: 'Product Team',
    description: 'Building the core product experience',
    color: '#c8ff57',
    createdBy: 'u1',
    memberIds: ['u1', 'u2', 'u3'],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'team2',
    name: 'Design Squad',
    description: 'UI/UX and visual design',
    color: '#9b7dff',
    createdBy: 'u1',
    memberIds: ['u1', 'u3'],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export function TeamsProvider({ children }) {
  const [teams, setTeams] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tf_teams'));
      return stored || DEMO_TEAMS;
    } catch {
      return DEMO_TEAMS;
    }
  });

  useEffect(() => {
    localStorage.setItem('tf_teams', JSON.stringify(teams));
  }, [teams]);

  const createTeam = (name, description, color, createdBy) => {
    const team = {
      id: uuidv4(),
      name: name.trim(),
      description: description.trim(),
      color: color || '#c8ff57',
      createdBy,
      memberIds: [createdBy],
      createdAt: new Date().toISOString(),
    };
    setTeams(prev => [team, ...prev]);
    return team;
  };

  const deleteTeam = (teamId) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  const updateTeam = (teamId, updates) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, ...updates } : t));
  };

  const addMember = (teamId, userId) => {
    setTeams(prev => prev.map(t =>
      t.id === teamId && !t.memberIds.includes(userId)
        ? { ...t, memberIds: [...t.memberIds, userId] }
        : t
    ));
  };

  const removeMember = (teamId, userId) => {
    setTeams(prev => prev.map(t =>
      t.id === teamId
        ? { ...t, memberIds: t.memberIds.filter(id => id !== userId) }
        : t
    ));
  };

  const getTeamMembers = (teamId, allUsers) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return [];
    return allUsers.filter(u => team.memberIds.includes(u.id));
  };

  return (
    <TeamsContext.Provider value={{ teams, createTeam, deleteTeam, updateTeam, addMember, removeMember, getTeamMembers }}>
      {children}
    </TeamsContext.Provider>
  );
}

export const useTeams = () => useContext(TeamsContext);
