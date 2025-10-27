import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadWatchlist, saveWatchlist, clearWatchlistStorage } from '@/utils/watchlistUtils';
import { WatchlistItem } from '@/types.d';

describe('Watchlist Utilities (Phase 1)', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('localStorage utilities', () => {
    it('should load empty watchlist when localStorage is empty', () => {
      const result = loadWatchlist();
      expect(result).toEqual([]);
    });

    it('should save watchlist to localStorage', () => {
      const watchlistItems: WatchlistItem[] = [
        {
          id: '550',
          type: 'movie',
          title: 'Fight Club',
          poster_path: '/pB8BM7pdSp6B6Ie8DQlJp1wAwh6.jpg',
          addedAt: Date.now(),
        },
      ];

      saveWatchlist(watchlistItems);

      const stored = localStorage.getItem('tmovies_watchlist');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].id).toBe('550');
    });

    it('should load watchlist from localStorage', () => {
      const watchlistData: WatchlistItem[] = [
        {
          id: '550',
          type: 'movie',
          title: 'Fight Club',
          poster_path: '/pB8BM7pdSp6B6Ie8DQlJp1wAwh6.jpg',
          addedAt: Date.now(),
        },
      ];

      localStorage.setItem('tmovies_watchlist', JSON.stringify(watchlistData));

      const result = loadWatchlist();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('550');
      expect(result[0].type).toBe('movie');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('tmovies_watchlist', 'invalid json');

      const result = loadWatchlist();
      expect(result).toEqual([]);
    });

    it('should clear watchlist from localStorage', () => {
      const watchlistItems: WatchlistItem[] = [
        {
          id: '550',
          type: 'movie',
          title: 'Fight Club',
          poster_path: '/pB8BM7pdSp6B6Ie8DQlJp1wAwh6.jpg',
          addedAt: Date.now(),
        },
      ];

      saveWatchlist(watchlistItems);
      expect(localStorage.getItem('tmovies_watchlist')).not.toBeNull();

      clearWatchlistStorage();
      expect(localStorage.getItem('tmovies_watchlist')).toBeNull();
    });
  });

  describe('watchlist data structure', () => {
    it('should have correct watchlist item structure', () => {
      const item: WatchlistItem = {
        id: '550',
        type: 'movie',
        title: 'Fight Club',
        poster_path: '/pB8BM7pdSp6B6Ie8DQlJp1wAwh6.jpg',
        addedAt: Date.now(),
      };

      expect(item.id).toBe('550');
      expect(item.type).toBe('movie');
      expect(item.title).toBe('Fight Club');
      expect(item.poster_path).toBe('/pB8BM7pdSp6B6Ie8DQlJp1wAwh6.jpg');
      expect(typeof item.addedAt).toBe('number');
    });

    it('should handle TV show items', () => {
      const tvItem: WatchlistItem = {
        id: '1399',
        type: 'tv',
        title: 'Breaking Bad',
        poster_path: '/ggFHVNvVeFxEmojieBF5P0fWQga.jpg',
        addedAt: Date.now(),
      };

      expect(tvItem.type).toBe('tv');
      expect(tvItem.title).toBe('Breaking Bad');
    });
  });
});
