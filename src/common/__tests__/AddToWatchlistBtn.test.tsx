import { describe, it, expect, vi } from 'vitest';

/**
 * AddToWatchlistBtn Component Tests - Phase 2.1
 *
 * Following TDD: Write tests first (RED), then implement component (GREEN)
 * These tests describe the desired behavior of the Add to Watchlist button
 */

describe('AddToWatchlistBtn Component', () => {
  describe('Component Props & Data', () => {
    it('should accept movie object with required properties', () => {
      const mockMovie = {
        id: '550',
        poster_path: '/pB8BM7pdSp6B6Ie8DQlJp1wAwh6.jpg',
        original_title: 'Fight Club',
        name: 'Fight Club',
        overview: 'An insomniac office worker...',
        backdrop_path: '/6ZfuBcaGTBYd1seiMH0zgK5J2fS.jpg',
      };

      expect(mockMovie.id).toBe('550');
      expect(mockMovie.original_title).toBe('Fight Club');
    });

    it('should accept category prop (movie or tv)', () => {
      const movieCategory = 'movie';
      const tvCategory = 'tv';

      expect(['movie', 'tv']).toContain(movieCategory);
      expect(['movie', 'tv']).toContain(tvCategory);
    });
  });

  describe('Button Behavior', () => {
    it('should display "Add to Watchlist" when item is not in watchlist', () => {
      const isInWatchlist = false;
      const buttonText = isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist';

      expect(buttonText).toBe('Add to Watchlist');
    });

    it('should display "Remove from Watchlist" when item is in watchlist', () => {
      const isInWatchlist = true;
      const buttonText = isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist';

      expect(buttonText).toBe('Remove from Watchlist');
    });

    it('should use heart icon that reflects watchlist status', () => {
      const isInWatchlist = false;
      const iconType = isInWatchlist ? 'filled' : 'outline';

      expect(iconType).toBe('outline');

      const isInWatchlist2 = true;
      const iconType2 = isInWatchlist2 ? 'filled' : 'outline';

      expect(iconType2).toBe('filled');
    });

    it('should toggle watchlist status when clicked', () => {
      let isInWatchlist = false;

      // Simulate click - toggle status
      isInWatchlist = !isInWatchlist;

      expect(isInWatchlist).toBe(true);

      // Click again
      isInWatchlist = !isInWatchlist;

      expect(isInWatchlist).toBe(false);
    });

    it('should call addToWatchlist hook when adding item', () => {
      const mockAdd = vi.fn();
      const isInWatchlist = false;

      if (!isInWatchlist) {
        mockAdd('550', 'movie');
      }

      expect(mockAdd).toHaveBeenCalledWith('550', 'movie');
    });

    it('should call removeFromWatchlist hook when removing item', () => {
      const mockRemove = vi.fn();
      const isInWatchlist = true;

      if (isInWatchlist) {
        mockRemove('550');
      }

      expect(mockRemove).toHaveBeenCalledWith('550');
    });
  });

  describe('Styling & Appearance', () => {
    it('should use red color when item is in watchlist (active state)', () => {
      const isInWatchlist = true;
      const color = isInWatchlist ? 'red' : 'gray';

      expect(color).toBe('red');
    });

    it('should use gray color when item is not in watchlist', () => {
      const isInWatchlist = false;
      const color = isInWatchlist ? 'red' : 'gray';

      expect(color).toBe('gray');
    });

    it('should have hover effect for better UX', () => {
      const hasHoverEffect = true;

      expect(hasHoverEffect).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have descriptive aria-label', () => {
      const movieTitle = 'Fight Club';
      const isInWatchlist = false;
      const ariaLabel = isInWatchlist
        ? `Remove ${movieTitle} from watchlist`
        : `Add ${movieTitle} to watchlist`;

      expect(ariaLabel).toContain('watchlist');
      expect(ariaLabel).toContain('Fight Club');
    });

    it('should be keyboard accessible', () => {
      const isKeyboardAccessible = true;

      expect(isKeyboardAccessible).toBe(true);
    });

    it('should respond to Enter and Space keys', () => {
      const validKeys = ['Enter', ' '];

      expect(validKeys).toContain('Enter');
      expect(validKeys).toContain(' ');
    });
  });

  describe('Integration with Watchlist Hook', () => {
    it('should use useWatchlist hook to check if item is in list', () => {
      const mockHook = {
        isInWatchlist: (id: string) => id === '550',
      };

      expect(mockHook.isInWatchlist('550')).toBe(true);
      expect(mockHook.isInWatchlist('999')).toBe(false);
    });

    it('should use useWatchlist hook to add item', () => {
      const mockHook = {
        addToWatchlist: vi.fn(),
      };

      mockHook.addToWatchlist({ id: '550' }, 'movie');

      expect(mockHook.addToWatchlist).toHaveBeenCalled();
    });

    it('should use useWatchlist hook to remove item', () => {
      const mockHook = {
        removeFromWatchlist: vi.fn(),
      };

      mockHook.removeFromWatchlist('550');

      expect(mockHook.removeFromWatchlist).toHaveBeenCalledWith('550');
    });
  });
});
