import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TaskContext = createContext(null);

const DEMO_TASKS = [
  { id: 't1', title: 'Design the app homepage', description: 'Create wireframes and mockups for the landing page', priority: 'high', status: 'done', category: 'Design', assignedTo: 'u1', createdBy: 'u1', dueDate: '2025-06-10', createdAt: new Date(Date.now() - 86400000*3).toISOString(), comments: [{ id: 'c1', userId: 'u2', text: 'Looks great! Really clean design.', createdAt: new Date(Date.now() - 3600000).toISOString() }], tags: ['UI', 'frontend'] },
  { id: 't2', title: 'Set up authentication backend', description: 'Implement JWT-based login and registration endpoints', priority: 'high', status: 'in-progress', category: 'Backend', assignedTo: 'u2', createdBy: 'u2', dueDate: '2025-06-15', createdAt: new Date(Date.now() - 86400000*2).toISOString(), comments: [], tags: ['API', 'security'] },
  { id: 't3', title: 'Write unit tests', description: 'Cover all major components with Jest tests', priority: 'medium', status: 'todo', category: 'Testing', assignedTo: 'u3', createdBy: 'u1', dueDate: '2025-06-20', createdAt: new Date(Date.now() - 86400000).toISOString(), comments: [], tags: ['testing', 'quality'] },
  { id: 't4', title: 'Deploy to Vercel', description: 'Set up CI/CD and deploy the app to production', priority: 'medium', status: 'todo', category: 'DevOps', assignedTo: 'u1', createdBy: 'u2', dueDate: '2025-06-22', createdAt: new Date(Date.now() - 3600000*5).toISOString(), comments: [], tags: ['deployment'] },
  { id: 't5', title: 'Conduct user testing sessions', description: 'Gather feedback from 5 test users and iterate', priority: 'low', status: 'todo', category: 'Research', assignedTo: 'u3', createdBy: 'u3', dueDate: '2025-06-25', createdAt: new Date().toISOString(), comments: [], tags: ['UX', 'feedback'] },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tf_tasks')) || DEMO_TASKS; } catch { return DEMO_TASKS; }
  });

  useEffect(() => {
    localStorage.setItem('tf_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    const newTask = {
      id: uuidv4(),
      ...task,
      status: 'todo',
      createdAt: new Date().toISOString(),
      comments: [],
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addComment = (taskId, userId, text) => {
    const comment = { id: uuidv4(), userId, text, createdAt: new Date().toISOString() };
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, comments: [...(t.comments || []), comment] } : t
    ));
  };

  const moveTask = (id, status) => updateTask(id, { status });

  const getStats = () => {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const high = tasks.filter(t => t.priority === 'high').length;
    return { total, done, inProgress, todo, high };
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, addComment, moveTask, getStats }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
