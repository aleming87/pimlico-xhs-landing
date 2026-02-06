"use client";
import { useState, useEffect, createContext, useContext } from 'react';

const WorkflowContext = createContext(null);

// Workflow stages
export const STAGES = [
  { key: 'ideas',       label: 'Ideas',       icon: '💡', color: 'purple' },
  { key: 'drafting',    label: 'Drafting',     icon: '✏️', color: 'blue' },
  { key: 'collateral',  label: 'Collateral',   icon: '🎨', color: 'indigo' },
  { key: 'copy',        label: 'Copy',         icon: '📝', color: 'cyan' },
  { key: 'publishing',  label: 'Publishing',   icon: '🚀', color: 'green' },
];

const STORAGE_KEY = 'xhs-workflow-items';

function loadItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

export function WorkflowProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => { setItems(loadItems()); }, []);

  const persist = (updated) => {
    setItems(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addItem = (item) => {
    const newItem = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title: '',
      description: '',
      stage: 'ideas',
      priority: 'medium',
      tags: [],
      articleSlug: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scheduledDate: null,
      platforms: [],
      marketingAssets: [],
      copyVariants: [],
      notes: '',
      ...item,
    };
    persist([newItem, ...items]);
    return newItem;
  };

  const updateItem = (id, updates) => {
    persist(items.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i));
  };

  const deleteItem = (id) => {
    persist(items.filter(i => i.id !== id));
  };

  const moveToStage = (id, stage) => {
    updateItem(id, { stage });
  };

  const getByStage = (stage) => items.filter(i => i.stage === stage);

  const stats = {
    total: items.length,
    byStage: Object.fromEntries(STAGES.map(s => [s.key, items.filter(i => i.stage === s.key).length])),
    thisWeek: items.filter(i => {
      const d = new Date(i.updatedAt);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return d >= weekAgo;
    }).length,
    scheduled: items.filter(i => i.scheduledDate).length,
  };

  return (
    <WorkflowContext.Provider value={{ items, addItem, updateItem, deleteItem, moveToStage, getByStage, stats }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflow must be used within WorkflowProvider');
  return ctx;
}
