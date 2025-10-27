import { useState } from 'react';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

import { useWatchlist } from '@/hooks/useWatchlist';
import { useMotion } from '@/hooks/useMotion';
import { maxWidth, mainHeading, paragraph } from '@/styles';
import { cn } from '@/utils/helper';
import MovieCard from '@/common/MovieCard';

type SortOption = 'dateAdded' | 'dateAddedDesc' | 'titleAsc' | 'titleDesc';
type FilterOption = 'all' | 'movie' | 'tv';

const Watchlist = () => {
  const { items, removeFromWatchlist } = useWatchlist();
  const { staggerContainer, fadeDown } = useMotion();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState<SortOption>('dateAddedDesc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  // Filter items
  const filteredItems = items.filter((item) => {
    if (filterBy === 'all') return true;
    return item.type === filterBy;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'dateAdded':
        return a.addedAt - b.addedAt;
      case 'dateAddedDesc':
        return b.addedAt - a.addedAt;
      case 'titleAsc':
        return a.title.localeCompare(b.title);
      case 'titleDesc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const handleRemove = (id: string) => {
    removeFromWatchlist(id);
  };

  const handleCardClick = (id: string, type: 'movie' | 'tv') => {
    navigate(`/${type}/${id}`);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all items from your watchlist?')) {
      items.forEach((item) => removeFromWatchlist(item.id));
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className={maxWidth}>
        <m.div
          variants={staggerContainer(0.2, 0.3)}
          initial="hidden"
          animate="show"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
            <m.div variants={fadeDown}>
              <h1 className={cn(mainHeading, 'text-gray-100')}>My Watchlist</h1>
              <p className={cn(paragraph, 'text-gray-400 mt-2')}>
                {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'}
              </p>
            </m.div>

            {sortedItems.length > 0 && (
              <m.button
                variants={fadeDown}
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                <FaTrash className="text-sm" />
                Clear All
              </m.button>
            )}
          </div>

          {/* Filters and Sort Controls */}
          {sortedItems.length > 0 && (
            <m.div
              variants={fadeDown}
              className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-gray-800 dark:bg-gray-900 rounded-lg"
            >
              {/* Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Filter by Type
                </label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="all">All</option>
                  <option value="movie">Movies</option>
                  <option value="tv">TV Shows</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="dateAddedDesc">Recently Added</option>
                  <option value="dateAdded">Oldest Added</option>
                  <option value="titleAsc">Title (A-Z)</option>
                  <option value="titleDesc">Title (Z-A)</option>
                </select>
              </div>
            </m.div>
          )}

          {/* Items Grid */}
          {sortedItems.length > 0 ? (
            <m.div
              variants={staggerContainer(0.1, 0.2)}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {sortedItems.map((item) => (
                <m.div
                  key={item.id}
                  variants={fadeDown}
                  className="relative group"
                >
                  <div
                    onClick={() => handleCardClick(item.id, item.type)}
                    className="cursor-pointer h-full"
                  >
                    <MovieCard
                      movie={{
                        id: item.id,
                        original_title: item.title,
                        name: item.title,
                        poster_path: item.poster_path,
                      } as any}
                      category={item.type}
                    />
                  </div>

                  {/* Remove Button on Hover */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    aria-label={`Remove ${item.title} from watchlist`}
                    title="Remove from watchlist"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </m.div>
              ))}
            </m.div>
          ) : (
            <m.div
              variants={fadeDown}
              className="text-center py-16"
            >
              <h2 className={cn(mainHeading, 'text-gray-300 mb-4')}>
                Your watchlist is empty
              </h2>
              <p className={cn(paragraph, 'text-gray-400 mb-8')}>
                Start adding movies and TV shows to keep track of what you want to watch!
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Browse Content
              </button>
            </m.div>
          )}
        </m.div>
      </div>
    </div>
  );
};

export default Watchlist;
