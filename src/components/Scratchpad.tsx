import { useState } from 'react';
import { FileText, Copy, Check, Trash2 } from 'lucide-react';
import type { ThemeMode } from '../types.ts';

interface ScratchpadProps {
  theme: ThemeMode;
  notes: string;
  onUpdateNotes: (text: string) => void;
  onClearNotes: () => void;
}

export function Scratchpad({
  theme,
  notes,
  onUpdateNotes,
  onClearNotes,
}: ScratchpadProps) {
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;

  const handleCopy = async () => {
    if (!notes) return;
    try {
      await navigator.clipboard.writeText(notes);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleConfirmClear = () => {
    onClearNotes();
    setShowClearConfirm(false);
  };

  const cardBg = theme === 'sand' ? '#FFFFFF' : '#1C1D21';
  const borderColor = theme === 'sand' ? '#E5E3DC' : '#2A2B30';
  const textColor = theme === 'sand' ? '#1C1917' : '#F9FAFB';
  const mutedText = theme === 'sand' ? '#78716C' : '#9CA3AF';
  const inputBg = theme === 'sand' ? '#F5F4F0' : '#141517';

  return (
    <section
      id="scratchpad-section"
      className="p-5 sm:p-6 rounded-2xl border transition-colors flex flex-col justify-between"
      style={{
        backgroundColor: cardBg,
        borderColor: borderColor,
      }}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" style={{ color: theme === 'sand' ? '#44403C' : '#E5E7EB' }} />
            <h2 className="text-sm font-semibold tracking-tight" style={{ color: textColor }}>
              Quick Thoughts
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="copy-notes-btn"
              type="button"
              onClick={handleCopy}
              disabled={!notes.trim()}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: inputBg,
                borderColor: borderColor,
                color: copied ? '#059669' : mutedText,
              }}
              title="Copy notes to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-[11px] font-medium text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span className="text-[11px] font-medium">Copy</span>
                </>
              )}
            </button>

            {showClearConfirm ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleConfirmClear}
                  className="text-[10px] font-semibold text-red-600 px-1.5 py-0.5 rounded bg-red-100 hover:bg-red-200 cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="text-[10px] text-stone-500 px-1 py-0.5 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                id="clear-notes-btn"
                type="button"
                onClick={() => setShowClearConfirm(true)}
                disabled={!notes.trim()}
                className="p-1 rounded-md text-xs transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ color: mutedText }}
                title="Clear notes"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <textarea
          id="scratchpad-textarea"
          value={notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder="Jot down quick thoughts, links, or ideas for today..."
          rows={6}
          className="w-full text-xs sm:text-sm p-3.5 rounded-xl border outline-none resize-none transition-colors leading-relaxed font-sans"
          style={{
            backgroundColor: inputBg,
            borderColor: borderColor,
            color: textColor,
          }}
        />
      </div>

      <div
        className="flex items-center justify-between pt-3 border-t text-[11px] font-mono-digits"
        style={{ borderColor, color: mutedText }}
      >
        <span>
          {wordCount} {wordCount === 1 ? 'word' : 'words'} • {charCount} chars
        </span>
        <span className="text-[10px] uppercase tracking-wider">Auto-saved</span>
      </div>
    </section>
  );
}
