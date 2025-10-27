import { memo } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { useWatchlist } from '@/hooks/useWatchlist';
import { cn } from 'clsx';

const WatchlistBadge = memo(() => {
  const { getCount } = useWatchlist();
  const count = getCount();

  // Don't show badge if count is 0 (optional)
  if (count === 0) {
    return null;
  }

  // Show 99+ for large counts
  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <Link
      to="/watchlist"
      aria-label={`${count} items in watchlist`}
      className={cn(
        'relative',
        'inline-flex items-center justify-center',
        'p-2 rounded-full',
        'text-red-600 dark:text-red-500',
        'hover:scale-110 transition-transform duration-200',
        'cursor-pointer'
      )}
    >
      <FaHeart className="text-lg" />

      {/* Badge with count */}
      <span
        className={cn(
          'absolute',
          '-top-1 -right-1',
          'flex items-center justify-center',
          'min-w-[20px] h-5',
          'bg-red-600 text-white',
          'text-xs font-bold',
          'rounded-full',
          'px-1'
        )}
      >
        {displayCount}
      </span>
    </Link>
  );
});

WatchlistBadge.displayName = 'WatchlistBadge';

export default WatchlistBadge;
