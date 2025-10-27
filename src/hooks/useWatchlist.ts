import { useContext } from 'react';
import { WatchlistContext } from '@/context/watchlistContext';
import { WatchlistContextType } from '@/types.d';

/**
 * Custom hook to access watchlist context
 * Must be used within WatchlistProvider
 */
export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);

  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }

  return context;
};
