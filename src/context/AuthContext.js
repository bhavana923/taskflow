import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext(null);

const DEMO_USERS = [
  { id: 'u1', name: 'Aanya Sharma', email: 'aanya@taskflow.app', password: 'demo123', avatar: 'AS', color: '#c8ff57' },
  { id: 'u2', name: 'Rohan Mehta', email: 'rohan@taskflow.app', password: 'demo123', avatar: 'RM', color: '#9b7dff' },
  { id: 'u3', name: 'Priya Nair', email: 'priya@taskflow.app', password: 'demo123', avatar: 'PN', color: '#ff7c57' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tf_user')); } catch { return null; }
  });
  const [allUsers, setAllUsers] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tf_users'));
      return stored || DEMO_USERS;
    } catch { return DEMO_USERS; }
  });

  useEffect(() => {
    localStorage.setItem('tf_users', JSON.stringify(allUsers));
  }, [allUsers]);

  const login = (email, password) => {
    const found = allUsers.find(u => u.email === email && u.password === password);
    if (!found) return { error: 'Invalid email or password.' };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('tf_user', JSON.stringify(safeUser));
    return { success: true };
  };

  const signup = (name, email, password) => {
    if (allUsers.find(u => u.email === email)) return { error: 'Email already in use.' };
    const initials = name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const colors = ['#c8ff57', '#9b7dff', '#ff7c57', '#57c8ff', '#ff57c8'];
    const color = colors[allUsers.length % colors.length];
    const newUser = { id: uuidv4(), name: name.trim(), email, password, avatar: initials, color };
    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem('tf_user', JSON.stringify(safeUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tf_user');
  };

  const getUserById = (id) => {
    const found = allUsers.find(u => u.id === id);
    if (!found) return null;
    const { password: _, ...safe } = found;
    return safe;
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, allUsers: allUsers.map(({ password, ...u }) => u), getUserById }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
