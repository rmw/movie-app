export interface ITheme {
  title: string;
  icon: IconType;
}

export interface INavLink extends ITheme {
  path: string;
}

export interface IMovie {
  id: string;
  poster_path: string;
  original_title: string;
  name: string;
  overview: string;
  backdrop_path: string
}

export interface WatchlistItem {
  id: string;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string;
  addedAt: number;
}

export interface WatchlistContextType {
  items: WatchlistItem[];
  addToWatchlist: (movie: IMovie, type: 'movie' | 'tv') => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  getCount: () => number;
  getSorted: (items: WatchlistItem[], sortBy: 'date-new' | 'date-old' | 'title') => WatchlistItem[];
  getFiltered: (filter: 'all' | 'movie' | 'tv') => WatchlistItem[];
}

