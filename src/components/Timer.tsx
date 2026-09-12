import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Sparkles } from 'lucide-react';
import type { ThemeMode } from '../types.ts';
import { playGentleChime } from '../utils/audio.ts';

interface TimerProps {
  theme: ThemeMode;
  completedSessions: number;
  onIncrementSession: () => void;
}

const PRESETS = [
  { label: '25m', seconds: 25 * 60, name: 'Focus' },
  { label: '15m', seconds: 15 * 60, name: 'Short' },
  { label: '45m', seconds: 45 * 60, name: 'Deep' },
  { label: '5m', seconds: 5 * 60, name: 'Rest' },
];

export function Timer({ theme, completedSessions, onIncrementSession }: TimerProps) {
  const [selectedDuration, setSelectedDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Clean timer loop
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            playGentleChime();
            onIncrementSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, onIncrementSession]);

  const handleSelectPreset = (seconds: number) => {
    setIsRunning(false);
    setSelectedDuration(seconds);
    setTimeLeft(seconds);
  };

  const handleTogglePlay = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedDuration);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progress = selectedDuration > 0 ? ((selectedDuration - timeLeft) / selectedDuration) * 100 : 0;

  const cardBg = theme === 'sand' ? '#FFFFFF' : '#1C1D21';
  const borderColor = theme === 'sand' ? '#E5E3DC' : '#2A2B30';
  const textColor = theme === 'sand' ? '#1C1917' : '#F9FAFB';
  const mutedText = theme === 'sand' ? '#78716C' : '#9CA3AF';
  const buttonActiveBg = theme === 'sand' ? '#292524' : '#F3F4F6';
  const buttonActiveText = theme === 'sand' ? '#FAFAF9' : '#111827';

  return (
    <section
      id="timer-section"
      className="p-5 sm:p-6 rounded-2xl border transition-colors flex flex-col justify-between"
      style={{
        backgroundColor: cardBg,
        borderColor: borderColor,
      }}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: theme === 'sand' ? '#44403C' : '#E5E7EB' }} />
            <h2 className="text-sm font-semibold tracking-tight" style={{ color: textColor }}>
              Focus Timer
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: mutedText }}>
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>
              <strong className="font-mono-digits" style={{ color: textColor }}>{completedSessions}</strong> completed
            </span>
          </div>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-4 gap-1.5 mb-6" id="timer-presets">
          {PRESETS.map((preset) => {
            const isActive = selectedDuration === preset.seconds;
            return (
              <button
                key={preset.label}
                id={`preset-${preset.label.toLowerCase()}`}
                type="button"
                onClick={() => handleSelectPreset(preset.seconds)}
                className="py-1.5 px-2 rounded-lg text-xs font-medium border transition-all cursor-pointer text-center"
                style={{
                  backgroundColor: isActive
                    ? buttonActiveBg
                    : theme === 'sand'
                    ? '#F5F4F0'
                    : '#141517',
                  borderColor: isActive ? buttonActiveBg : borderColor,
                  color: isActive ? buttonActiveText : mutedText,
                }}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Digits Display */}
        <div className="text-center my-4">
          <div
            id="timer-display"
            className="font-mono-digits text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums select-none"
            style={{ color: textColor }}
          >
            {formattedTime}
          </div>
          <div className="text-[11px] font-medium tracking-wide uppercase mt-1" style={{ color: mutedText }}>
            {isRunning ? 'Flow in progress' : timeLeft === 0 ? 'Session completed' : 'Ready to start'}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full overflow-hidden mb-6" style={{ backgroundColor: theme === 'sand' ? '#E7E5E4' : '#2A2B30' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              backgroundColor: theme === 'sand' ? '#44403C' : '#D1D5DB',
            }}
          />
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          id="timer-play-pause-btn"
          type="button"
          onClick={handleTogglePlay}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          style={{
            backgroundColor: isRunning
              ? theme === 'sand'
                ? '#E7E5E4'
                : '#2A2B30'
              : buttonActiveBg,
            borderColor: borderColor,
            color: isRunning ? textColor : buttonActiveText,
          }}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start</span>
            </>
          )}
        </button>

        <button
          id="timer-reset-btn"
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer"
          style={{
            backgroundColor: theme === 'sand' ? '#F5F4F0' : '#141517',
            borderColor: borderColor,
            color: mutedText,
          }}
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="sr-only">Reset</span>
        </button>
      </div>
    </section>
  );
}
