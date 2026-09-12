/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import type { FocusTask, ThemeMode } from './types.ts';
import { Header } from './components/Header.tsx';
import { FocusGoal } from './components/FocusGoal.tsx';
import { Timer } from './components/Timer.tsx';
import { Scratchpad } from './components/Scratchpad.tsx';
import { QuoteSection } from './components/QuoteSection.tsx';

const DEFAULT_TASKS: FocusTask[] = [
  { id: '1', text: 'Outline the key project deliverables', completed: true },
  { id: '2', text: 'Complete uninterrupted 25-minute deep focus block', completed: false },
  { id: '3', text: 'Review notes & clean up desk', completed: false },
];

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('focuspad_theme');
    return (saved as ThemeMode) || 'sand';
  });

  // Core focus state
  const [coreFocus, setCoreFocus] = useState<string>(() => {
    const saved = localStorage.getItem('focuspad_core_focus');
    return saved !== null ? saved : 'Complete primary sprint milestone';
  });

  const [isCoreCompleted, setIsCoreCompleted] = useState<boolean>(() => {
    const saved = localStorage.getItem('focuspad_core_completed');
    return saved === 'true';
  });

  // Task list state
  const [tasks, setTasks] = useState<FocusTask[]>(() => {
    try {
      const saved = localStorage.getItem('focuspad_tasks');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_TASKS;
  });

  // Scratchpad notes
  const [notes, setNotes] = useState<string>(() => {
    return localStorage.getItem('focuspad_notes') || '• Key insight: Start small, maintain momentum.\n• Next checkpoint at 3:00 PM.';
  });

  // Completed focus sessions
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    const saved = localStorage.getItem('focuspad_sessions');
    return saved ? parseInt(saved, 10) : 1;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('focuspad_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('focuspad_core_focus', coreFocus);
  }, [coreFocus]);

  useEffect(() => {
    localStorage.setItem('focuspad_core_completed', String(isCoreCompleted));
  }, [isCoreCompleted]);

  useEffect(() => {
    localStorage.setItem('focuspad_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('focuspad_notes', notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('focuspad_sessions', String(completedSessions));
  }, [completedSessions]);

  // Handlers
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'sand' ? 'slate' : 'sand'));
  };

  const handleAddTask = (text: string) => {
    const newTask: FocusTask = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleIncrementSession = () => {
    setCompletedSessions((prev) => prev + 1);
  };

  const handleResetDay = () => {
    if (window.confirm('Reset all daily intentions, notes, and session counts for a fresh day?')) {
      setCoreFocus('Set today\'s primary focus...');
      setIsCoreCompleted(false);
      setTasks([]);
      setNotes('');
      setCompletedSessions(0);
    }
  };

  // Canvas background colors
  const pageBg = theme === 'sand' ? '#F7F6F2' : '#141517';
  const subtextColor = theme === 'sand' ? '#78716C' : '#6B7280';

  return (
    <div
      id="focus-app-root"
      className="min-h-screen transition-colors duration-300 flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6"
      style={{ backgroundColor: pageBg }}
    >
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header Bar */}
        <Header theme={theme} onToggleTheme={handleToggleTheme} />

        {/* Core Application Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Daily Anchor / Tasks */}
          <FocusGoal
            theme={theme}
            coreFocus={coreFocus}
            isCoreCompleted={isCoreCompleted}
            onUpdateCoreFocus={setCoreFocus}
            onToggleCoreCompleted={() => setIsCoreCompleted(!isCoreCompleted)}
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />

          {/* Focus Timer */}
          <Timer
            theme={theme}
            completedSessions={completedSessions}
            onIncrementSession={handleIncrementSession}
          />
        </div>

        {/* Quick Scratchpad */}
        <Scratchpad
          theme={theme}
          notes={notes}
          onUpdateNotes={setNotes}
          onClearNotes={() => setNotes('')}
        />

        {/* Daily Quote / Mindful Reflection */}
        <QuoteSection theme={theme} />

        {/* Minimal Bottom Bar */}
        <div className="flex items-center justify-between text-xs pt-2" style={{ color: subtextColor }}>
          <span>Designed for quiet focus & clarity</span>
          <button
            id="reset-day-btn"
            type="button"
            onClick={handleResetDay}
            className="hover:underline cursor-pointer transition-colors"
          >
            Start fresh day
          </button>
        </div>
      </div>
    </div>
  );
}
