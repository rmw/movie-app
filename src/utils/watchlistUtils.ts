import { WatchlistItem } from '@/types.d';

const WATCHLIST_KEY = 'tmovies_watchlist';

/**
 * Load watchlist from localStorage
 */
export const loadWatchlist = (): WatchlistItem[] => {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as WatchlistItem[];
  } catch {
    // Handle corrupted data gracefully
    return [];
  }
};

/**
 * Save watchlist to localStorage
 */
export const saveWatchlist = (items: WatchlistItem[]): void => {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
  } catch {
    console.error('Failed to save watchlist to localStorage');
  }
};

/**
 * Clear watchlist from localStorage
 */
export const clearWatchlistStorage = (): void => {
  try {
    localStorage.removeItem(WATCHLIST_KEY);
  } catch {
    console.error('Failed to clear watchlist from localStorage');
  }
};
