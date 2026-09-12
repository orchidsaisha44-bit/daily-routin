import { useState, type FormEvent } from 'react';
import { Target, CheckCircle2, Circle, Plus, Trash2, Check } from 'lucide-react';
import type { FocusTask, ThemeMode } from '../types.ts';

interface FocusGoalProps {
  theme: ThemeMode;
  coreFocus: string;
  isCoreCompleted: boolean;
  onUpdateCoreFocus: (val: string) => void;
  onToggleCoreCompleted: () => void;
  tasks: FocusTask[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function FocusGoal({
  theme,
  coreFocus,
  isCoreCompleted,
  onUpdateCoreFocus,
  onToggleCoreCompleted,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: FocusGoalProps) {
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isEditingCore, setIsEditingCore] = useState(false);
  const [coreDraft, setCoreDraft] = useState(coreFocus);

  const completedCount = tasks.filter((t) => t.completed).length;

  const handleSaveCore = () => {
    if (coreDraft.trim()) {
      onUpdateCoreFocus(coreDraft.trim());
    }
    setIsEditingCore(false);
  };

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    onAddTask(newTaskInput.trim());
    setNewTaskInput('');
  };

  const cardBg = theme === 'sand' ? '#FFFFFF' : '#1C1D21';
  const borderColor = theme === 'sand' ? '#E5E3DC' : '#2A2B30';
  const textColor = theme === 'sand' ? '#1C1917' : '#F9FAFB';
  const mutedText = theme === 'sand' ? '#78716C' : '#9CA3AF';
  const inputBg = theme === 'sand' ? '#F5F4F0' : '#141517';

  return (
    <section
      id="focus-goal-section"
      className="p-5 sm:p-6 rounded-2xl border transition-colors flex flex-col justify-between"
      style={{
        backgroundColor: cardBg,
        borderColor: borderColor,
      }}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" style={{ color: theme === 'sand' ? '#44403C' : '#E5E7EB' }} />
            <h2 className="text-sm font-semibold tracking-tight" style={{ color: textColor }}>
              Daily Anchor
            </h2>
          </div>
          <span className="text-xs font-mono-digits" style={{ color: mutedText }}>
            {completedCount}/{tasks.length} done
          </span>
        </div>

        {/* Core Priority Banner */}
        <div
          id="core-focus-banner"
          className="p-3.5 rounded-xl border mb-5 flex items-start gap-3 transition-colors"
          style={{
            backgroundColor: isCoreCompleted
              ? theme === 'sand'
                ? '#F0FDF4'
                : '#052E16'
              : inputBg,
            borderColor: isCoreCompleted
              ? theme === 'sand'
                ? '#BBF7D0'
                : '#166534'
              : borderColor,
          }}
        >
          <button
            id="toggle-core-focus-btn"
            type="button"
            onClick={onToggleCoreCompleted}
            className="mt-0.5 cursor-pointer text-stone-500 hover:text-stone-800 transition-colors"
            title="Mark primary intention complete"
          >
            {isCoreCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Circle className="w-5 h-5" style={{ color: mutedText }} />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <span className="text-[11px] uppercase tracking-wider font-semibold block mb-0.5" style={{ color: mutedText }}>
              Main Intention
            </span>
            {isEditingCore ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="core-focus-input"
                  type="text"
                  value={coreDraft}
                  onChange={(e) => setCoreDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveCore();
                    if (e.key === 'Escape') setIsEditingCore(false);
                  }}
                  autoFocus
                  className="w-full text-sm px-2.5 py-1 rounded-lg border outline-none font-medium"
                  style={{
                    backgroundColor: theme === 'sand' ? '#FFFFFF' : '#1C1D21',
                    borderColor: borderColor,
                    color: textColor,
                  }}
                />
                <button
                  id="save-core-focus-btn"
                  type="button"
                  onClick={handleSaveCore}
                  className="p-1.5 rounded-md bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 cursor-pointer"
                  title="Save intention"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <p
                id="core-focus-text"
                onClick={() => {
                  setCoreDraft(coreFocus);
                  setIsEditingCore(true);
                }}
                className={`text-sm font-medium cursor-pointer transition-all ${
                  isCoreCompleted ? 'line-through opacity-70' : ''
                }`}
                style={{ color: textColor }}
                title="Click to edit intention"
              >
                {coreFocus || 'Click to set today\'s single priority...'}
              </p>
            )}
          </div>
        </div>

        {/* Priority items list */}
        <div className="space-y-2 mb-4">
          <span className="text-xs font-semibold tracking-tight block" style={{ color: mutedText }}>
            Priority Steps
          </span>
          {tasks.length === 0 ? (
            <p className="text-xs italic py-2" style={{ color: mutedText }}>
              No tasks added yet. Keep it simple and focused.
            </p>
          ) : (
            <ul className="space-y-1.5" id="task-list">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  id={`task-item-${task.id}`}
                  className="flex items-center justify-between gap-2.5 p-2 rounded-lg group transition-colors hover:bg-stone-500/5"
                >
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    className="flex items-center gap-2.5 text-left cursor-pointer flex-1 min-w-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 shrink-0" style={{ color: mutedText }} />
                    )}
                    <span
                      className={`text-xs sm:text-sm truncate ${
                        task.completed ? 'line-through opacity-60' : ''
                      }`}
                      style={{ color: textColor }}
                    >
                      {task.text}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 hover:text-red-600 transition-all cursor-pointer"
                    title="Remove task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Add new task input */}
      <form onSubmit={handleAddTask} className="flex items-center gap-2 pt-2 border-t" style={{ borderColor }}>
        <input
          id="new-task-input"
          type="text"
          placeholder="Add a step..."
          value={newTaskInput}
          onChange={(e) => setNewTaskInput(e.target.value)}
          maxLength={80}
          className="flex-1 text-xs sm:text-sm px-3 py-2 rounded-lg border outline-none transition-colors"
          style={{
            backgroundColor: inputBg,
            borderColor: borderColor,
            color: textColor,
          }}
        />
        <button
          id="add-task-btn"
          type="submit"
          disabled={!newTaskInput.trim()}
          className="inline-flex items-center justify-center p-2 rounded-lg border font-medium text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: theme === 'sand' ? '#292524' : '#E5E7EB',
            borderColor: theme === 'sand' ? '#1C1917' : '#D1D5DB',
            color: theme === 'sand' ? '#FAFAF9' : '#18181B',
          }}
          title="Add step"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </section>
  );
}
