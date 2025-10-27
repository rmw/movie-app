# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

```bash
# Development
npm run dev          # Start Vite dev server at http://localhost:5173

# Production
npm run build        # Compile TypeScript + build with Vite
npm run preview      # Preview production build locally

# No testing or linting scripts configured
# ESLint runs automatically during dev via vite-plugin-eslint
```

## Project Overview

**tMovies** is a React-based movie discovery web app that lets users search, browse, and watch trailers for movies and TV shows. It's a single-page application (SPA) built with:

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Routing**: React Router v6
- **API**: TMDB (The Movie Database) via Redux Toolkit Query (RTK Query)
- **Animations**: Framer Motion + Swiper
- **Hosting**: Vercel
- **Analytics**: Google Analytics 4
- **Monetization**: Google AdSense

## Architecture

### Data Flow

```
User Action (navigate, search, click)
    ↓
React Router updates URL
    ↓
RTK Query fetches from TMDB API (with caching)
    ↓
Global Context manages UI state (modal, sidebar, theme)
    ↓
Components render with lazy-loaded images
    ↓
Framer Motion animations (respecting reduced motion preference)
```

### Folder Structure

```
src/
├── pages/           # Route components (Home, Catalog, Detail, NotFound)
├── common/          # Reusable components (MovieCard, Header, Footer, etc.)
├── context/         # Global state (globalContext, themeContext)
├── services/        # API integration (TMDB.ts with RTK Query)
├── hooks/           # Custom hooks (useMotion, useOnClickOutside, useOnKeyPress)
├── utils/           # Utilities (config.ts for env vars, helper.ts for functions)
├── constants/       # App constants (nav links, theme options, sections)
├── styles/          # Reusable Tailwind class combinations
├── types/           # TypeScript interfaces (IMovie, ITheme, INavLink)
├── App.tsx          # Route definitions (/, /:category, /:category/:id, *)
└── main.tsx         # Entry point (Redux store, Context providers)
```

### Routes

- `/` → Home page with hero carousel and movie sections
- `/movie` → Movie catalog with search/filtering
- `/tv` → TV series catalog with search/filtering
- `/movie/:id` → Movie detail page with cast, videos, similar movies
- `/tv/:id` → TV series detail page with cast, videos, similar shows
- `*` → 404 Not Found page

### State Management

**Redux Toolkit Query (RTK Query)** - Data fetching & caching
- Handles TMDB API calls
- Automatic deduplication and caching
- Used in hooks: `useGetShowsQuery()`, `useGetShowQuery()`

**React Context API** - Global UI state
- `globalContext.tsx` - Modal/sidebar/video state
- `themeContext.tsx` - Dark/Light theme + localStorage persistence

**Component State** - Local page state
- Pagination (Catalog page)
- Search queries
- UI toggles (show more/less)

## Key Patterns

### Component Pattern
```typescript
// Functional components with TypeScript
const MovieCard = ({ movie, category }: { movie: IMovie; category: string }) => {
  const { poster_path, original_title: title, name, id } = movie;
  return (/* JSX */);
};

export default memo(MovieCard);  // Memoized to prevent unnecessary re-renders
```

### Custom Hooks
```typescript
// Hooks extract reusable logic
const { videoId, closeModal } = useGlobalContext();
const { theme, setTheme } = useTheme();
const { zoomIn, fadeDown, staggerContainer } = useMotion();
```

### API Calls (RTK Query)
```typescript
// RTK Query provides caching and automatic refetching
const { data, isLoading, isError } = useGetShowsQuery({
  category: "movie",
  type: "popular",
  page: 1,
});
```

### Styling with Tailwind
```typescript
// Reusable class combinations in src/styles/index.ts
export const watchBtn = `sm:text-base xs:text-[14.75px] text-[13.75px] ...`;

// Dynamic class merging with cn() helper
<button className={cn(watchBtn, "bg-red-600")}>Watch Trailer</button>
```

### Animations (Framer Motion)
```typescript
// Animation variants from useMotion() hook
<m.div
  variants={staggerContainer(0.2, 0.3)}
  initial="hidden"
  animate="show"
>
  <m.h2 variants={fadeDown}>Title</m.h2>
  <m.p variants={fadeDown}>Description</m.p>
</m.div>

// Respects user's prefers-reduced-motion setting
// Automatically disabled on screens ≤768px
```

### Lazy Loading
```typescript
// Images lazy load when visible in viewport
<Image
  src={imageUrl}
  alt="description"
  effect="zoomIn"  // Animation on load
/>

// Sections lazy load when they come into view
const { inView } = useInView(ref, { margin: "420px", once: true });
const { data } = useGetShowsQuery({...}, { skip: !inView });
```

### Global Context Hook Pattern
```typescript
// Check theme context for example
const { theme, setTheme, openMenu, closeMenu } = useTheme();

// On theme change, automatically:
// 1. Updates component state
// 2. Applies dark/light class to HTML element
// 3. Saves preference to localStorage
```

## Environment Variables

Create a `.env` file in the project root:

```
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_API_KEY=your_tmdb_api_key
VITE_GA_MEASUREMENT_ID=your_ga_id_or_leave_blank
VITE_GOOGLE_AD_CLIENT=your_ad_client_or_leave_blank
VITE_GOOGLE_AD_SLOT=your_ad_slot_or_leave_blank
```

Get TMDB API key from: https://www.themoviedb.org/settings/api

## Accessibility Features

1. **Reduced Motion Support** - Animations completely disabled for users with `prefers-reduced-motion`
2. **Dark/Light Theme** - Respects system preference with manual override
3. **Keyboard Navigation** - ESC closes modals, Tab navigates through interactive elements
4. **Semantic HTML** - Proper heading hierarchy, list elements for navigation
5. **Image Alt Text** - All images have descriptive alt attributes

## Performance Optimizations

1. **Image Lazy Loading** - `react-lazy-load-image-component` defers image loading
2. **Section Lazy Loading** - `useInView()` delays API calls until section is visible
3. **Component Memoization** - `memo()` prevents unnecessary re-renders
4. **Code Splitting** - Route components use `lazy()` with `Suspense`
5. **Throttling** - Scroll events throttled at 150ms
6. **RTK Query Caching** - Prevents duplicate API requests
7. **Animations Optimization** - Framer Motion `domAnimation` preset, disabled on mobile (<768px)

## TypeScript Setup

- **Strict Mode**: `"strict": true` in tsconfig.json
- **Path Alias**: `@/` maps to `src/` for clean imports
- **Interfaces**: Defined in `src/types.d.ts` (IMovie, ITheme, INavLink)
- **Generics**: Components typed with TypeScript generics (e.g., `FC<Props>`)

## Dependencies to Know

| Package | Purpose | Key Notes |
|---------|---------|-----------|
| `react` + `react-dom` | UI library | React 18.2 |
| `react-router-dom` | Client routing | v6.6.2 |
| `@reduxjs/toolkit` | RTK Query for data fetching | With caching |
| `framer-motion` | Animations | With reduced motion support |
| `tailwindcss` | Utility CSS | With dark mode |
| `swiper` | Image carousel/slider | For hero carousel |
| `react-icons` | Icon library | MoonStars, Sun, Menu, etc. |
| `react-lazy-load-image` | Image lazy loading | With fade-in effect |
| `react-ga4` | Google Analytics | Page tracking |
| `@ctrl/react-adsense` | Google AdSense | Ad slots |

## Common Tasks

### Add a New Page
1. Create folder in `src/pages/YourPage/`
2. Create `index.tsx` with page component
3. Create `components/` subfolder for page-specific components
4. Add route in `src/App.tsx`:
   ```typescript
   <Route path="/yourpath" element={<YourPage />} />
   ```

### Add a Reusable Component
1. Create folder in `src/common/YourComponent/`
2. Create `index.tsx` with component (default export)
3. Import and use in pages or other components
4. Consider `memo()` if component receives same props frequently

### Fetch Data
1. Add query endpoint in `src/services/TMDB.ts`:
   ```typescript
   getYourData: builder.query({
     query: (params) => `endpoint?api_key=${API_KEY}&params`
   })
   ```
2. Export hook: `export const { useGetYourDataQuery } = tmdbApi;`
3. Use in component:
   ```typescript
   const { data, isLoading, isError } = useGetYourDataQuery({...});
   ```

### Add Global State
1. Create context in `src/context/yourContext.tsx`
2. Create provider component
3. Wrap app in `src/main.tsx` with provider
4. Create custom hook for easy access: `useYourState()`

### Style with Tailwind
1. Use inline classes: `className="flex gap-4 md:gap-6 sm:gap-3"`
2. Add reusable combinations to `src/styles/index.ts`:
   ```typescript
   export const buttonClass = `py-2 px-4 rounded hover:scale-105 ...`;
   ```
3. Use `cn()` helper to merge dynamic classes:
   ```typescript
   <button className={cn(buttonClass, isActive && "bg-red-600")}>
   ```

### Add Animations
1. Import from `useMotion()` hook:
   ```typescript
   const { fadeDown, slideIn, staggerContainer } = useMotion();
   ```
2. Use with Framer Motion:
   ```typescript
   <m.div variants={fadeDown} initial="hidden" animate="show">
   ```
3. Animations automatically respect `prefers-reduced-motion`

## Development Best Practices

### Code Quality & Consistency

1. **Follow Existing Patterns**
   - Match the component structure of existing files in `src/pages/` and `src/common/`
   - Use the same naming conventions (PascalCase for components, camelCase for functions)
   - Import order: React → external deps → local components → types
   - Example: See `src/pages/Detail/index.tsx` and `src/common/MovieCard/index.tsx`

2. **TypeScript Best Practices**
   - Always define prop types explicitly (no implicit `any`)
   - Use interfaces for object shapes, types for unions/primitives
   - Example:
     ```typescript
     interface MovieCardProps {
       movie: IMovie;
       category: 'movie' | 'tv';
     }
     ```
   - Leverage path aliases: `import { IMovie } from '@/types'` instead of relative paths

3. **Code Organization**
   - Keep files small and focused (single responsibility)
   - Extract logic into custom hooks when reusable
   - Move reusable styles to `src/styles/index.ts`
   - Keep components in `src/common/`, page-specific components in page folders

4. **Naming Conventions**
   - Components: `PascalCase` (MovieCard.tsx, Header.tsx)
   - Functions/variables: `camelCase` (fetchMovies, isLoading)
   - Constants: `UPPER_CASE` (API_KEY, MAX_ITEMS)
   - Files: Match component name (MovieCard/index.tsx)
   - Custom hooks: Start with `use` (useMotion, useWatchlist)

### Testing & Validation

1. **Manual Testing for Each Feature**
   - Test the feature in browser at http://localhost:5173
   - Test on mobile (toggle device toolbar in DevTools)
   - Test with dark mode enabled
   - Test with reduced motion enabled (DevTools → Rendering → Emulate CSS media feature)
   - Clear localStorage and browser cache to test fresh state

2. **Testing Checklist Before Committing**
   - ✅ Feature works as expected in browser
   - ✅ No console errors or TypeScript warnings
   - ✅ ESLint passes (check terminal output while dev server runs)
   - ✅ Responsive design works (xs, sm, md, lg breakpoints)
   - ✅ Dark mode works correctly
   - ✅ Reduced motion preference respected
   - ✅ No broken links or missing imports
   - ✅ localStorage/state persists across refresh

3. **Specific Feature Testing**
   - **New Page**: Navigate via header, verify route works, check page loads data
   - **New Component**: Use in multiple contexts, verify props work as expected
   - **New API Call**: Check Network tab, verify data in browser DevTools → Storage
   - **New State**: Add console.log to verify state updates, check localStorage if persisted
   - **New Animation**: Check on mobile, check with reduced motion enabled

4. **Browser DevTools Inspection**
   - **Network Tab**: Verify API calls to TMDB, check response times
   - **Storage Tab**: Verify localStorage updates for theme, watchlist, etc.
   - **Console**: No errors, check ESLint warnings
   - **Elements/Inspector**: Verify correct HTML structure, classes applied
   - **Performance**: Check for unnecessary re-renders (React DevTools Profiler)

### Git & Commits

**Repository**: https://github.com/sudeepmahato16/movie-app

**Deployment**: Vercel (https://tmovies-blush.vercel.app/)
- Automatic deployment on push to main branch
- SPA routing configured in `vercel.json`
- Environment variables set in Vercel dashboard

**Commit Convention**: Conventional Commits with clear, descriptive messages

**Format**:
```
<type>(<scope>): <subject>

<body>
```

**Types**:
- `feat:` new feature (watchlist, filtering, etc.)
- `fix:` bug fix (broken component, state issue, etc.)
- `refactor:` code restructuring (same behavior, different implementation)
- `chore:` dependencies, config, build tools
- `docs:` documentation, spec files, comments

**Examples**:
```
feat(watchlist): add context and localStorage integration

- Create WatchlistContext for global state management
- Add useWatchlist custom hook for easy access
- Implement localStorage persistence
- Add TypeScript interfaces for WatchlistItem

feat(detail): add "Add to Watchlist" button

- Integrate AddToWatchlistBtn component on detail page
- Show visual feedback (button state changes) on add/remove
- Test persistence across page refresh

fix(header): prevent watchlist badge from overflowing on mobile

- Adjust badge size on screens < 640px
- Ensure proper spacing in responsive layout

refactor(styles): consolidate button styles into shared utilities

- Extract watchBtn, addBtn classes to src/styles/index.ts
- Reduces code duplication across components
- Maintains design consistency

docs(spec): add watchlist feature specification

- Document requirements, design approach, implementation phases
- Provide testing checklist for developers
```

**Best Practices**:
- Write descriptive commit messages (why, not just what)
- Keep commits focused (one feature/fix per commit)
- Group related changes (don't mix features and refactors)
- Reference related issues or specs in commit body
- Test before committing (no broken builds)

**No CI/CD workflows or pre-commit hooks currently configured.**

## Testing Framework

**Vitest + React Testing Library** is configured for automated testing using Test-Driven Development (TDD).

### Quick Commands

```bash
npm run test          # Run tests in watch mode (recommended during development)
npm run test:ui       # Open Vitest UI for visual test runner
npm run test:run      # Run all tests once (CI mode)
npm run test:coverage # Generate coverage report
```

### TDD Workflow: Red → Green → Refactor

Always follow this pattern when adding features:

1. **RED**: Write a failing test that describes desired behavior
2. **GREEN**: Write minimal code to make the test pass
3. **REFACTOR**: Improve code quality while keeping tests passing

**Example Workflow**:
```typescript
// Step 1: Write test first
// src/common/__tests__/MyButton.test.tsx
it('should display button with correct text', () => {
  renderWithProviders(<MyButton label="Click me" />);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

// Step 2: Write minimal component
// src/common/MyButton/index.tsx
const MyButton = ({ label }) => <button>{label}</button>;

// Step 3: Refactor with styling/logic
const MyButton = ({ label, onClick }) => (
  <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={onClick}>
    {label}
  </button>
);
```

### Test File Organization

Place test files in `__tests__/` folders next to source code:

```
src/
├── common/
│   ├── MovieCard/
│   │   ├── index.tsx
│   │   └── __tests__/
│   │       └── MovieCard.test.tsx
├── hooks/
│   ├── useMotion.ts
│   └── __tests__/
│       └── useMotion.test.ts
└── test/
    ├── setup.ts           # Test configuration
    ├── test-utils.tsx     # Custom render function
    └── TESTING.md         # Detailed testing guide
```

### Complete Testing Guide

See `src/test/TESTING.md` for:
- Test templates for components and hooks
- Testing patterns (async, forms, navigation, etc.)
- Best practices and common mistakes
- Debugging tips
- Coverage targets

### Example Tests

**Component Test** (`src/common/__tests__/MovieCard.test.tsx`):
- Renders correct title and image
- Links to correct route
- Handles TV show vs movie categories
- Has proper accessibility attributes

**Hook Test** (`src/hooks/__tests__/useOnKeyPress.test.ts`):
- Triggers callback on correct key press
- Ignores other keys
- Respects enable flag
- Cleans up event listeners on unmount

### Pre-Commit Testing Checklist

Before committing, verify:

```
✅ npm run test:run passes locally
✅ No console errors in test output
✅ New features have tests covering main behaviors
✅ Existing tests still pass
✅ Code coverage hasn't decreased significantly
```

### Testing Best Practices

1. **Test behavior, not implementation**
   - ❌ Don't test internal state or props
   - ✅ Test what users see and interact with

2. **Use semantic queries**
   ```typescript
   // Accessible: find by role
   screen.getByRole('button', { name: /submit/i })

   // Form inputs: find by label
   screen.getByLabelText(/email/i)

   // Last resort: find by test ID
   screen.getByTestId('custom-element')
   ```

3. **Test user interactions, not clicks**
   ```typescript
   // Better: simulates real user behavior
   await userEvent.click(button);
   await userEvent.type(input, 'text');
   ```

4. **Mock external dependencies**
   ```typescript
   // Mock API calls, navigation, external libraries
   global.fetch = vi.fn(() => Promise.resolve(...))
   ```

5. **Test edge cases and error states**
   ```typescript
   // Empty state, loading state, error state
   it('should show error when data fails to load', () => {...})
   ```

## Debugging Tips

1. **Redux DevTools**: Install browser extension to inspect RTK Query cache
2. **React DevTools**: Inspect component tree, hooks, state changes
3. **Network Tab**: Check TMDB API requests, verify API key works
4. **Storage Tab**: Check localStorage for theme preference
5. **Console**: ESLint warnings during dev, error stack traces
6. **Vercel Deployment**: Check build logs at vercel.com if deploy fails

## Known Issues & Considerations

1. **localStorage Quota**: Watchlist feature (when added) will use localStorage; max ~5MB per domain
2. **TMDB API Rate Limiting**: Free tier allows 40 requests per 10 seconds
3. **Image Loading**: Uses TMDB CDN; images may be slow on poor connections (mitigated by lazy loading)
4. **Dark Mode Flash**: On first load, theme might briefly flash as wrong color (load theme from localStorage before render)
5. **Mobile Performance**: Animations disabled on screens <768px for better performance

## Resources

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **React Router**: https://reactrouter.com/docs
- **Redux Toolkit**: https://redux-toolkit.js.org/
- **TMDB API**: https://www.themoviedb.org/settings/api
- **Vite**: https://vitejs.dev/guide/

