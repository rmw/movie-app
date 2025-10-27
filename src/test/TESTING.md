# Testing Guide - Test-Driven Development (TDD)

This guide explains how to use the automated test framework and follow TDD practices in this project.

## Quick Start

```bash
# Run tests in watch mode (recommended during development)
npm run test

# Open Vitest UI for visual test runner
npm run test:ui

# Run all tests once (CI mode)
npm run test:run

# Generate coverage report
npm run test:coverage
```

## TDD Workflow: Red → Green → Refactor

### Step 1: Write the Test First (RED)

Before writing any component code, write a test that describes the desired behavior:

```typescript
// src/common/__tests__/MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import MyComponent from '@/common/MyComponent';
import { renderWithProviders } from '@/test/test-utils';

describe('MyComponent', () => {
  it('should display a welcome message', () => {
    renderWithProviders(<MyComponent />);

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
  });

  it('should render a button that is clickable', () => {
    renderWithProviders(<MyComponent />);

    const button = screen.getByRole('button');
    expect(button).toBeEnabled();
  });
});
```

Run the test: `npm run test`
**Result**: ❌ Tests fail (RED phase)

### Step 2: Write Minimal Code (GREEN)

Write the simplest code to make the test pass:

```typescript
// src/common/MyComponent/index.tsx
const MyComponent = () => {
  return (
    <div>
      <h1>Welcome!</h1>
      <button>Click me</button>
    </div>
  );
};

export default MyComponent;
```

Run the test: `npm run test`
**Result**: ✅ Tests pass (GREEN phase)

### Step 3: Improve Code Quality (REFACTOR)

Now refactor the code while keeping tests passing:

```typescript
// Refactored version
const MyComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Welcome!</h1>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Click me ({count})
      </button>
    </div>
  );
};

export default MyComponent;
```

Run the test: `npm run test`
**Result**: ✅ Tests still pass (REFACTOR complete)

## Testing Best Practices

### 1. Test Behavior, Not Implementation

**❌ Bad**: Testing internal state or props
```typescript
// Don't do this
it('should set count state to 1', () => {
  const { getByTestId } = renderWithProviders(<Counter />);
  expect(getByTestId('count-state')).toBe(1);
});
```

**✅ Good**: Testing what users see and interact with
```typescript
// Do this
it('should display count and increment when button is clicked', () => {
  renderWithProviders(<Counter />);

  const button = screen.getByRole('button', { name: /increment/i });
  fireEvent.click(button);

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 2. Use Query Priority

Always use queries in this order:

1. **getByRole** - Accessible, reflects HTML semantics
   ```typescript
   screen.getByRole('button', { name: /add/i })
   screen.getByRole('link', { name: /about/i })
   ```

2. **getByLabelText** - Form labels
   ```typescript
   screen.getByLabelText(/username/i)
   ```

3. **getByPlaceholderText** - Input placeholders
   ```typescript
   screen.getByPlaceholderText(/search/i)
   ```

4. **getByText** - Text content
   ```typescript
   screen.getByText(/welcome/i)
   ```

5. **getByTestId** - Last resort for testing IDs
   ```typescript
   screen.getByTestId('custom-element')
   ```

### 3. Test User Interactions

```typescript
import { fireEvent, userEvent } from '@testing-library/react';

describe('Form', () => {
  it('should submit form when button is clicked', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(<Form onSubmit={handleSubmit} />);

    // Better: Use userEvent (simulates real user behavior)
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: /submit/i });

    await user.click(button);

    expect(handleSubmit).toHaveBeenCalledOnce();
  });
});
```

### 4. Test Async Behavior

```typescript
import { waitFor } from '@testing-library/react';

describe('DataFetcher', () => {
  it('should display loaded data', async () => {
    renderWithProviders(<DataFetcher />);

    // Wait for async operation to complete
    await waitFor(() => {
      expect(screen.getByText(/Data loaded/i)).toBeInTheDocument();
    });
  });
});
```

### 5. Mock External Dependencies

```typescript
import { vi } from 'vitest';

describe('API Component', () => {
  it('should display error when API fails', async () => {
    // Mock the API call
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('API Error'))
    );

    renderWithProviders(<APIComponent />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

## File Organization

```
src/
├── common/
│   ├── MovieCard/
│   │   ├── index.tsx           # Component
│   │   └── __tests__/
│   │       └── MovieCard.test.tsx  # Tests
│   └── Header/
│       ├── index.tsx
│       └── __tests__/
│           └── Header.test.tsx
├── pages/
│   ├── Home/
│   │   ├── index.tsx
│   │   └── __tests__/
│   │       └── Home.test.tsx
├── hooks/
│   ├── useMotion.ts
│   └── __tests__/
│       └── useMotion.test.ts
└── test/
    ├── setup.ts                # Test configuration
    └── test-utils.tsx          # Custom render function
```

## Component Test Template

```typescript
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import MyComponent from '@/path/MyComponent';
import { renderWithProviders } from '@/test/test-utils';

describe('MyComponent', () => {
  // Test successful render
  it('should render without errors', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  // Test user interactions
  it('should handle click events', async () => {
    const handleClick = vi.fn();
    renderWithProviders(<MyComponent onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  // Test accessibility
  it('should have proper accessibility attributes', () => {
    renderWithProviders(<MyComponent />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
  });

  // Test edge cases
  it('should handle empty state gracefully', () => {
    renderWithProviders(<MyComponent items={[]} />);
    expect(screen.getByText(/no items/i)).toBeInTheDocument();
  });

  // Test prop variations
  it('should render differently based on props', () => {
    const { rerender } = renderWithProviders(<MyComponent type="primary" />);

    expect(screen.getByRole('button')).toHaveClass('bg-blue');

    rerender(<MyComponent type="secondary" />);

    expect(screen.getByRole('button')).toHaveClass('bg-gray');
  });
});
```

## Hook Test Template

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '@/hooks/useMyHook';

describe('useMyHook', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useMyHook());

    expect(result.current.value).toBe(initialValue);
  });

  it('should update state when action is called', () => {
    const { result } = renderHook(() => useMyHook());

    act(() => {
      result.current.setValue('new value');
    });

    expect(result.current.value).toBe('new value');
  });

  it('should handle side effects', async () => {
    const { result } = renderHook(() => useMyHook());

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.data).toBeDefined();
  });
});
```

## Common Testing Patterns

### Testing Conditional Rendering

```typescript
it('should show loading state', () => {
  renderWithProviders(<Component isLoading={true} />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

it('should show error state', () => {
  renderWithProviders(<Component isError={true} error="Something went wrong" />);
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});

it('should show success state', () => {
  renderWithProviders(<Component data={mockData} />);
  expect(screen.getByText(mockData.title)).toBeInTheDocument();
});
```

### Testing Navigation

```typescript
it('should navigate to correct route', () => {
  renderWithProviders(<Navigation />);

  const link = screen.getByRole('link', { name: /movies/i });
  expect(link).toHaveAttribute('href', '/movie');
});
```

### Testing Forms

```typescript
it('should validate and submit form', async () => {
  const handleSubmit = vi.fn();
  renderWithProviders(<Form onSubmit={handleSubmit} />);

  const input = screen.getByLabelText(/email/i);
  const button = screen.getByRole('button', { name: /submit/i });

  await userEvent.type(input, 'test@example.com');
  await userEvent.click(button);

  expect(handleSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
});
```

## Debugging Tests

### View DOM Output
```typescript
import { screen, debug } from '@testing-library/react';

it('should debug DOM', () => {
  renderWithProviders(<Component />);

  // Print entire DOM to console
  screen.debug();

  // Print specific element
  screen.debug(screen.getByRole('button'));
});
```

### Use Vitest UI
```bash
npm run test:ui
```
Opens a visual test runner at `http://localhost:51204`

### Common Issues

**Issue**: `screen.getByRole` not finding element
**Solution**: Use `screen.logTestingPlaygroundURL()` to get HTML structure

```typescript
it('debug test', () => {
  renderWithProviders(<Component />);
  screen.logTestingPlaygroundURL();
  // Copy URL and paste in browser to see DOM
});
```

## Coverage Reports

Generate and view coverage:

```bash
npm run test:coverage
```

Opens `coverage/index.html` with coverage breakdown:
- **Statements**: Code lines executed
- **Branches**: If/else paths covered
- **Functions**: Function calls covered
- **Lines**: Line coverage

**Target Coverage Goals**:
- Critical paths: 100%
- Core components: 80%+
- Utilities: 90%+

## Integrating with CI/CD

When deploying, run tests:

```bash
npm run test:run  # Exit with error if tests fail
npm run build     # Only build if tests pass
```

## Resources

- **Vitest Docs**: https://vitest.dev
- **Testing Library Docs**: https://testing-library.com/react
- **Best Practices**: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
