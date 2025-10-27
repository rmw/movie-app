import React, { createContext, useState, useEffect } from 'react';
import { IMovie, WatchlistItem, WatchlistContextType } from '@/types.d';
import { loadWatchlist, saveWatchlist, clearWatchlistStorage } from '@/utils/watchlistUtils';

export const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const saved = loadWatchlist();
    setItems(saved);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    saveWatchlist(items);
  }, [items]);

  const addToWatchlist = (movie: IMovie, type: 'movie' | 'tv') => {
    setItems((prev) => {
      // Check if item already exists
      if (prev.some((item) => item.id === movie.id)) {
        return prev;
      }

      const newItem: WatchlistItem = {
        id: movie.id,
        type,
        title: movie.original_title || movie.name,
        poster_path: movie.poster_path,
        addedAt: Date.now(),
      };

      return [newItem, ...prev];
    });
  };

  const removeFromWatchlist = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWatchlist = (id: string): boolean => {
    return items.some((item) => item.id === id);
  };

  const getCount = (): number => {
    return items.length;
  };

  const getSorted = (
    itemsToSort: WatchlistItem[],
    sortBy: 'date-new' | 'date-old' | 'title'
  ): WatchlistItem[] => {
    const sorted = [...itemsToSort];

    switch (sortBy) {
      case 'date-new':
        return sorted.sort((a, b) => b.addedAt - a.addedAt);
      case 'date-old':
        return sorted.sort((a, b) => a.addedAt - b.addedAt);
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const getFiltered = (filter: 'all' | 'movie' | 'tv'): WatchlistItem[] => {
    if (filter === 'all') {
      return items;
    }
    return items.filter((item) => item.type === filter);
  };

  const value: WatchlistContextType = {
    items,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    getCount,
    getSorted,
    getFiltered,
  };

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};

export default WatchlistProvider;
