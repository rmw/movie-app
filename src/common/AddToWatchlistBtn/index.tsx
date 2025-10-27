import { memo } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useWatchlist } from '@/hooks/useWatchlist';
import { IMovie } from '@/types.d';
import { cn } from 'clsx';

interface AddToWatchlistBtnProps {
  movie: IMovie;
  category: 'movie' | 'tv';
}

const AddToWatchlistBtn = memo(({ movie, category }: AddToWatchlistBtnProps) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const inWatchlist = isInWatchlist(movie.id);
  const movieTitle = movie.original_title || movie.name;

  const handleToggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie, category);
    }
  };

  const ariaLabel = inWatchlist
    ? `Remove ${movieTitle} from watchlist`
    : `Add ${movieTitle} to watchlist`;

  const buttonText = inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist';
  const HeartIcon = inWatchlist ? FaHeart : FaRegHeart;
  const heartColor = inWatchlist ? 'text-red-600' : 'text-gray-400';

  return (
    <button
      onClick={handleToggleWatchlist}
      aria-label={ariaLabel}
      className={cn(
        'flex items-center gap-2',
        'px-4 py-2 rounded-full',
        'font-medium text-sm',
        'transition-all duration-200',
        'hover:scale-105 active:scale-95',
        inWatchlist
          ? 'bg-red-600 text-white hover:bg-red-700'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
      )}
    >
      <HeartIcon className={cn('text-base', inWatchlist && 'text-white')} />
      <span>{buttonText}</span>
    </button>
  );
});

AddToWatchlistBtn.displayName = 'AddToWatchlistBtn';

export default AddToWatchlistBtn;
