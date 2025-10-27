# Watchlist Feature Specification

## 1. Overview

### What is it?
The Watchlist feature allows users to save their favorite movies and TV shows for quick access later. Users can build a personalized collection that persists across browser sessions.

### Business Goals
- **Increased Engagement** - Users return to the app to manage their watchlist
- **Better UX** - Quick access to saved content without searching again
- **Simple & Fast** - Instant add/remove with no loading states or API calls

### User Value
- Save movies/shows to watch later
- Organize favorites in one place
- Never lose track of content they want to watch
- Works offline

---

## 2. Functional Requirements

### 2.1 Core Features

#### Feature 1: Add to Watchlist
- **Description**: Users can add any movie or TV show to their watchlist
- **Where**: Available on Detail pages, Movie cards, and Home page sections
- **Action**: Click "Add to Watchlist" button/icon
- **Feedback**: Instant visual confirmation (button state changes, optional toast notification)
- **Data**: Item details (ID, type, title, poster, timestamp) are saved locally

#### Feature 2: Remove from Watchlist
- **Description**: Users can remove any item from their watchlist
- **Where**: Same locations as add, plus dedicated Watchlist page
- **Action**: Click button again to toggle off, or delete button on Watchlist page
- **Feedback**: Instant removal from list, visual confirmation

#### Feature 3: View Watchlist
- **Description**: Dedicated page to view all saved items
- **Path**: `/watchlist`
- **Content**: Grid display of all saved movies/shows (similar to Catalog page)
- **Empty State**: Message when no items saved
- **Responsive**: Mobile, tablet, and desktop friendly

#### Feature 4: Filter by Type
- **Description**: Show only movies OR only TV shows in watchlist
- **Location**: Watchlist page
- **Options**: "All", "Movies", "TV Shows"
- **Default**: "All"

#### Feature 5: Sort Watchlist
- **Description**: Control order of items in watchlist
- **Options**:
  - "Date Added (Newest)" - Most recent additions first
  - "Date Added (Oldest)" - Oldest additions first
  - "Title (A-Z)" - Alphabetical order
- **Default**: "Date Added (Newest)"

#### Feature 6: Watchlist Indicator
- **Description**: Visual feedback showing if an item is already in watchlist
- **Where**:
  - Detail page - Button shows "Remove from Watchlist" when item is saved
  - Movie cards (optional) - Heart icon filled/unfilled
  - Navigation - Badge showing count of saved items

### 2.2 Non-Functional Requirements

- **Performance**: Add/remove operations complete instantly (< 100ms)
- **Persistence**: Watchlist survives page refresh and browser restart
- **Capacity**: Support at least 500 items (practical limit for localStorage)
- **Storage**: Use browser localStorage (no backend required)
- **Offline**: Works completely offline after initial load
- **Compatibility**: Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- **Accessibility**: Full keyboard navigation, screen reader support

---

## 3. Design Approach

### 3.1 Architecture Overview

```
User Action (Click "Add to Watchlist")
          ↓
WatchlistContext Hook (useWatchlist)
          ↓
State Update + localStorage Sync
          ↓
Component Re-render with Updated UI
```

### 3.2 State Management Strategy

**Use React Context API** (following existing theme management pattern):

```typescript
// WatchlistContext provides:
{
  watchlistItems: WatchlistItem[];
  addToWatchlist(item: IMovie, type: 'movie' | 'tv'): void;
  removeFromWatchlist(id: string): void;
  isInWatchlist(id: string): boolean;
  getWatchlistCount(): number;
  getFilteredWatchlist(filter: 'all' | 'movie' | 'tv'): WatchlistItem[];
}
```

**Persistence Layer**:
- localStorage key: `tmovies_watchlist`
- Format: JSON array of WatchlistItem objects
- Sync on every add/remove operation

### 3.3 Data Flow

```
Detail Page / MovieCard
    ↓
User clicks "Add to Watchlist" button
    ↓
useWatchlist hook triggered
    ↓
- Add item to context state
- Serialize to JSON
- Save to localStorage
- Update UI (button text/icon changes)
    ↓
Page refresh:
- Load watchlist from localStorage on app boot
- Hydrate context with saved items
- Buttons reflect correct state
```

---

## 4. Data Model

### 4.1 TypeScript Interfaces

```typescript
// Single item in the watchlist
export interface WatchlistItem {
  id: string;              // TMDB ID
  type: 'movie' | 'tv';    // Content type
  title: string;           // Display title
  poster_path: string;     // Image URL path
  addedAt: number;         // Unix timestamp
}

// Context state structure
export interface WatchlistContextType {
  items: WatchlistItem[];
  addToWatchlist: (item: IMovie, type: 'movie' | 'tv') => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  getCount: () => number;
  clearWatchlist: () => void;
  getFiltered: (filter: 'all' | 'movie' | 'tv') => WatchlistItem[];
  getSorted: (items: WatchlistItem[], sortBy: 'date-new' | 'date-old' | 'title') => WatchlistItem[];
}

// Example watchlist structure in localStorage:
{
  "tmovies_watchlist": [
    {
      "id": "550",
      "type": "movie",
      "title": "Fight Club",
      "poster_path": "/pB8BM7pdSp6B6Ie8DQlJp1wAwh6.jpg",
      "addedAt": 1698432000000
    },
    {
      "id": "1399",
      "type": "tv",
      "title": "Breaking Bad",
      "poster_path": "/ggFHVNvVeFxEmojieBF5P0fWQga.jpg",
      "addedAt": 1698358400000
    }
  ]
}
```

---

## 5. Tech Stack

### Core Technologies (No New Dependencies!)

| Technology | Purpose | Why |
|---|---|---|
| **React Context API** | Global state management | Follows existing pattern (like theme), no new deps |
| **localStorage** | Data persistence | Browser built-in, perfect for user preferences |
| **TypeScript** | Type safety | Prevents bugs, matches app standard |
| **Tailwind CSS** | Styling | Consistent with existing design system |
| **React Router** | Watchlist page routing | Already in use, simple URL navigation |
| **Framer Motion** | Page animations | Optional, adds polish |

### File Structure

```
src/
├── context/
│   ├── watchlistContext.tsx    [NEW] Context + Provider
│   └── watchlistContext.types.ts [NEW] TypeScript interfaces
├── hooks/
│   └── useWatchlist.ts         [NEW] Custom hook for easy access
├── utils/
│   └── watchlistUtils.ts       [NEW] localStorage helpers
├── pages/
│   └── Watchlist/              [NEW] Watchlist page
│       ├── components/
│       │   ├── WatchlistHeader.tsx
│       │   ├── FilterSort.tsx
│       │   └── EmptyState.tsx
│       └── index.tsx
├── common/
│   ├── AddToWatchlistBtn.tsx   [NEW] Reusable button component
│   └── WatchlistBadge.tsx      [NEW] Header badge showing count
└── specs/
    └── WATCHLIST_SPEC.md       [NEW] This file
```

---

## 6. Implementation Phases

### Phase 1: Core Infrastructure (No UI yet)
**Goal**: Build foundation and validate data model

**Tasks**:
1. Create TypeScript types/interfaces
2. Create WatchlistContext with provider
3. Create localStorage utility functions
4. Create useWatchlist custom hook
5. Wrap app with WatchlistProvider in main.tsx

**Testing**:
- Console log to verify context works
- localStorage inspector to see data persisting
- Hook returns correct values

**Estimated Time**: 1-2 hours

---

### Phase 2: UI Components
**Goal**: Build reusable components

**Tasks**:
1. Create `AddToWatchlistBtn.tsx` component
   - Toggle button (add/remove)
   - Shows "Add" or "Remove" text
   - Uses heart icon
   - Integrates with useWatchlist hook

2. Create `WatchlistBadge.tsx` in Header
   - Shows count of items
   - Updates in real-time
   - Navigates to `/watchlist` on click

3. Create Watchlist page structure
   - Header with filters and sort options
   - Grid of movie cards (similar to Catalog)
   - Empty state message

**Testing**:
- Click button and see text change
- See count update in header
- Manually navigate to `/watchlist`

**Estimated Time**: 2-3 hours

---

### Phase 3: Integration
**Goal**: Connect feature to existing pages

**Tasks**:
1. Add "Add to Watchlist" button to Detail page
   - Below title or in header
   - Shows current status

2. Add watchlist count badge to Header
   - Show in navigation
   - Click to go to watchlist page

3. Wire up Watchlist page
   - Display saved items in grid
   - Implement filter dropdown
   - Implement sort dropdown
   - Add delete button on each card

4. Update routing in App.tsx
   - Add `/watchlist` route

**Testing**:
- Add item from Detail page
- See badge count increment
- Navigate to watchlist and see item
- Filter by type
- Sort by date/title
- Remove item and see it disappear

**Estimated Time**: 2-3 hours

---

### Phase 4: Polish & Edge Cases
**Goal**: Handle edge cases, optimize UX

**Tasks**:
1. Add animations
   - Smooth button state transitions
   - Page entry animation
   - Item add/remove transitions

2. Handle edge cases
   - Empty watchlist state
   - Max items (warn at 500)
   - localStorage quota exceeded
   - Corrupted data recovery

3. Accessibility
   - ARIA labels on buttons
   - Keyboard navigation
   - Screen reader friendly

4. Manual testing
   - Add/remove 50+ items
   - Filter and sort combinations
   - Refresh page and verify persistence
   - Test on mobile/tablet
   - Test on different browsers

**Testing**:
- Browser dev tools: Verify localStorage updates
- Mobile preview: Check responsive design
- Accessibility: Tab through all interactions
- Network tab: Verify no API calls needed

**Estimated Time**: 2-3 hours

---

## 7. Component & File Changes

### New Files to Create

```
src/specs/WATCHLIST_SPEC.md
src/context/watchlistContext.tsx
src/context/watchlistContext.types.ts
src/hooks/useWatchlist.ts
src/utils/watchlistUtils.ts
src/pages/Watchlist/index.tsx
src/pages/Watchlist/components/WatchlistHeader.tsx
src/pages/Watchlist/components/FilterSort.tsx
src/pages/Watchlist/components/EmptyState.tsx
src/common/AddToWatchlistBtn.tsx
src/common/WatchlistBadge.tsx
```

### Existing Files to Modify

| File | Change |
|---|---|
| `src/main.tsx` | Wrap app with `<WatchlistProvider>` |
| `src/App.tsx` | Add route: `<Route path="/watchlist" element={<Watchlist />}` |
| `src/pages/Detail/index.tsx` | Add `<AddToWatchlistBtn>` button |
| `src/common/Header/index.tsx` | Add `<WatchlistBadge>` next to theme menu |
| `src/types.d.ts` | Export WatchlistItem interface |

---

## 8. UI/UX Considerations

### 8.1 Button Design

**Add to Watchlist Button** (Detail page):
```
- Icon: Heart icon (filled when in watchlist, outline when not)
- Color: Red when active (#ff0000), gray when inactive
- Size: Match existing buttons on the page
- Text: "Add to Watchlist" / "Remove from Watchlist"
- Animation: Smooth scale/color transition on click
```

**Visual Example**:
```
Before clicking:          After clicking:
[♡ Add to Watchlist]  →  [♥ Remove from Watchlist]
 (Gray outline)           (Red filled)
```

### 8.2 Watchlist Badge (Header)

```
[♥ 12]  ← Shows count, red color, clickable to go to watchlist page
```

### 8.3 Watchlist Page Layout

```
┌─────────────────────────────────┐
│ My Watchlist              [♥ 12] │
├─────────────────────────────────┤
│ Filter: [All ▼]  Sort: [Newest ▼] │
├─────────────────────────────────┤
│                                  │
│  [Movie 1]  [Movie 2]  [Movie 3] │
│   ♥ Remove  ♥ Remove  ♥ Remove  │
│                                  │
│  [Movie 4]  [Movie 5]  [Movie 6] │
│   ♥ Remove  ♥ Remove  ♥ Remove  │
│                                  │
└─────────────────────────────────┘
```

### 8.4 Empty State

When no items in watchlist:
```
┌─────────────────────────────┐
│                             │
│        No items yet         │
│                             │
│   Start adding movies and   │
│   TV shows to your          │
│   watchlist to see them     │
│   here!                     │
│                             │
│   [Browse Movies]           │
│                             │
└─────────────────────────────┘
```

### 8.5 Animations

- **Button click**: Quick 200ms color/scale transition
- **Item added**: Subtle toast notification (optional)
- **Item removed**: Fade out 300ms before disappearing
- **Page load**: Stagger animation of watchlist items (like existing catalog)
- **Filter/sort**: Smooth transition of items reordering

### 8.6 Mobile Responsiveness

- **xs (< 640px)**: 2 columns, smaller cards
- **sm (640px+)**: 3 columns
- **md (768px+)**: 4 columns
- **lg (1024px+)**: 5 columns
- **xl (1280px+)**: 6 columns

(Follow existing Catalog page responsive pattern)

---

## 9. Why This Approach is Simple & Testable

### ✅ No Backend Required
- Data stored locally in browser
- No server calls needed
- Works completely offline

### ✅ No New Dependencies
- Uses React Context (already available)
- Uses localStorage (browser built-in)
- No npm packages to install

### ✅ Isolated Feature
- Won't break existing functionality
- Can be developed independently
- Can be disabled if needed by removing WatchlistProvider

### ✅ Easy Manual Testing
1. **Add item**: Go to movie detail page → Click "Add" → See button change
2. **Persist**: Refresh page → Button still shows "Remove" → Data persists
3. **View list**: Click badge in header or navigate to `/watchlist` → See all items
4. **Filter**: Change filter dropdown → List updates instantly
5. **Sort**: Change sort dropdown → List reorders instantly
6. **Remove item**: Click "Remove" button → Item disappears from list
7. **Empty state**: Remove all items → See empty message

### ✅ Progressive Implementation
- Build each phase independently
- Test after each phase
- Can stop and show working feature at any phase

### ✅ Clear Error Handling
- Check localStorage quota
- Handle corrupted data gracefully
- Fallback to empty watchlist if needed

### ✅ Follows Existing Patterns
- Uses Context like theme feature
- Uses localStorage like theme preference
- UI components follow existing design patterns
- Routing follows existing React Router setup

---

## 10. Success Criteria

### Phase 1 Complete:
- [ ] Context provides state correctly
- [ ] localStorage reads/writes working
- [ ] useWatchlist hook returns correct data

### Phase 2 Complete:
- [ ] Buttons render correctly
- [ ] Badge shows count
- [ ] Page navigation works

### Phase 3 Complete:
- [ ] Can add item from Detail page
- [ ] Count increments in header
- [ ] Watchlist page shows all items
- [ ] Filter/sort working
- [ ] Can remove items

### Phase 4 Complete:
- [ ] Animations smooth
- [ ] Mobile responsive
- [ ] No console errors
- [ ] localStorage persists across refresh
- [ ] Works in multiple browsers

---

## 11. Example User Flow

```
1. User browses to /movie/550 (Fight Club detail page)
   ↓
2. Clicks "Add to Watchlist" button
   ↓
3. Button changes to "Remove from Watchlist" (red heart icon)
   ↓
4. User sees badge in header changed from [♥ 5] to [♥ 6]
   ↓
5. User clicks badge or navigates to /watchlist
   ↓
6. Sees their watchlist with Fight Club included
   ↓
7. User filters to "Movies only"
   ↓
8. Watchlist updates to show only movie items
   ↓
9. User sorts by "Title A-Z"
   ↓
10. Items reorder alphabetically
    ↓
11. User clicks "Remove" on Fight Club
    ↓
12. Item disappears, count in header updates to [♥ 5]
```

---

## 12. Notes for Developers

- Keep watchlist operations synchronous (don't use async)
- Always sync localStorage after state changes
- Never make API calls for watchlist operations
- Test with browser DevTools: Storage → localStorage
- Use the same animation patterns as existing features (useMotion hook)
- Follow TypeScript strict mode
- Match existing code style and naming conventions

