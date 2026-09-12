import { useState } from 'react';
import { RefreshCw, Quote } from 'lucide-react';
import type { ThemeMode, DailyQuote } from '../types.ts';

interface QuoteSectionProps {
  theme: ThemeMode;
}

const CURATED_QUOTES: DailyQuote[] = [
  {
    quote: "Simplicity is about subtracting the obvious and adding the meaningful.",
    author: "John Maeda",
  },
  {
    quote: "Focus is a muscle. Practicing stillness is how we train it.",
    author: "Seneca",
  },
  {
    quote: "Do less, but do it with deep care and deliberate grace.",
    author: "Marcus Aurelius",
  },
  {
    quote: "The secret of getting ahead is getting started. The secret of getting started is breaking your complex tasks into small manageable tasks.",
    author: "Mark Twain",
  },
  {
    quote: "Nature does not hurry, yet everything is accomplished.",
    author: "Lao Tzu",
  },
  {
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
  },
];

export function QuoteSection({ theme }: QuoteSectionProps) {
  const [index, setIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const handleNextQuote = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % CURATED_QUOTES.length);
      setIsRotating(false);
    }, 150);
  };

  const current = CURATED_QUOTES[index];

  const cardBg = theme === 'sand' ? '#FFFFFF' : '#1C1D21';
  const borderColor = theme === 'sand' ? '#E5E3DC' : '#2A2B30';
  const textColor = theme === 'sand' ? '#292524' : '#F3F4F6';
  const mutedText = theme === 'sand' ? '#78716C' : '#9CA3AF';

  return (
    <footer
      id="daily-quote-section"
      className="p-5 sm:p-6 rounded-2xl border transition-colors relative overflow-hidden"
      style={{
        backgroundColor: cardBg,
        borderColor: borderColor,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <Quote className="w-5 h-5 shrink-0 mt-0.5" style={{ color: mutedText }} />
          <div className={`transition-opacity duration-200 ${isRotating ? 'opacity-30' : 'opacity-100'}`}>
            <p
              id="quote-text"
              className="font-serif-heading text-sm sm:text-base italic leading-relaxed"
              style={{ color: textColor }}
            >
              "{current.quote}"
            </p>
            <p
              id="quote-author"
              className="text-xs font-medium tracking-wide mt-1.5 uppercase"
              style={{ color: mutedText }}
            >
              — {current.author}
            </p>
          </div>
        </div>

        <button
          id="refresh-quote-btn"
          type="button"
          onClick={handleNextQuote}
          className="p-2 rounded-lg border transition-all cursor-pointer hover:rotate-45"
          style={{
            backgroundColor: theme === 'sand' ? '#F5F4F0' : '#141517',
            borderColor: borderColor,
            color: mutedText,
          }}
          title="Show next thought"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="sr-only">Refresh quote</span>
        </button>
      </div>
    </footer>
  );
}
