import { useState, useEffect } from 'react';
import { Sun, Moon, Volume2, Sparkles } from 'lucide-react';
import type { ThemeMode } from '../types.ts';
import { playGentleChime } from '../utils/audio.ts';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  let greeting = 'Good evening';
  if (hours < 12) greeting = 'Good morning';
  else if (hours < 17) greeting = 'Good afternoon';

  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedDate = time.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header
      id="app-header"
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b transition-colors"
      style={{
        borderColor: theme === 'sand' ? '#E5E3DC' : '#2A2B30',
      }}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-semibold"
            style={{
              backgroundColor: theme === 'sand' ? '#E7E5E4' : '#2A2B30',
              color: theme === 'sand' ? '#44403C' : '#E5E7EB',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span
            className="text-xs font-medium tracking-wide uppercase"
            style={{ color: theme === 'sand' ? '#78716C' : '#9CA3AF' }}
          >
            Daily Desk Companion
          </span>
        </div>
        <h1
          id="greeting-title"
          className="font-serif-heading text-2xl sm:text-3xl font-medium tracking-tight"
          style={{ color: theme === 'sand' ? '#1C1917' : '#F9FAFB' }}
        >
          {greeting}.
        </h1>
        <p
          className="text-xs sm:text-sm mt-0.5"
          style={{ color: theme === 'sand' ? '#78716C' : '#9CA3AF' }}
        >
          {formattedDate} • <span className="font-mono-digits">{formattedTime}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <button
          id="sound-test-btn"
          type="button"
          onClick={playGentleChime}
          title="Play gentle chime"
          className="inline-flex items-center justify-center p-2 rounded-lg border transition-all text-xs font-medium cursor-pointer"
          style={{
            backgroundColor: theme === 'sand' ? '#FFFFFF' : '#1C1D21',
            borderColor: theme === 'sand' ? '#E5E3DC' : '#2A2B30',
            color: theme === 'sand' ? '#57534E' : '#D1D5DB',
          }}
        >
          <Volume2 className="w-4 h-4" />
          <span className="sr-only">Test chime</span>
        </button>

        <button
          id="theme-toggle-btn"
          type="button"
          onClick={onToggleTheme}
          title={theme === 'sand' ? 'Switch to Dark Slate' : 'Switch to Warm Sand'}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-xs font-medium cursor-pointer"
          style={{
            backgroundColor: theme === 'sand' ? '#FFFFFF' : '#1C1D21',
            borderColor: theme === 'sand' ? '#E5E3DC' : '#2A2B30',
            color: theme === 'sand' ? '#44403C' : '#E5E7EB',
          }}
        >
          {theme === 'sand' ? (
            <>
              <Moon className="w-3.5 h-3.5" />
              <span>Slate</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5" />
              <span>Sand</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
