export interface FocusTask {
  id: string;
  text: string;
  completed: boolean;
}

export type ThemeMode = 'sand' | 'slate';

export interface DailyQuote {
  quote: string;
  author: string;
}
