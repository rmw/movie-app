import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOnKeyPress } from '@/hooks/useOnKeyPress';

describe('useOnKeyPress', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should trigger callback when specified key is pressed', () => {
    const callback = vi.fn();

    renderHook(() =>
      useOnKeyPress({ key: 'Escape', action: callback, enable: true })
    );

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not trigger callback when different key is pressed', () => {
    const callback = vi.fn();

    renderHook(() =>
      useOnKeyPress({ key: 'Escape', action: callback, enable: true })
    );

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not trigger callback when disabled', () => {
    const callback = vi.fn();

    renderHook(() =>
      useOnKeyPress({ key: 'Escape', action: callback, enable: false })
    );

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle case sensitivity correctly', () => {
    const callback = vi.fn();

    renderHook(() =>
      useOnKeyPress({ key: 'Escape', action: callback, enable: true })
    );

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'escape' });
      document.dispatchEvent(event);
    });

    // Should not match different case
    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle multiple key presses', () => {
    const callback = vi.fn();

    renderHook(() =>
      useOnKeyPress({ key: 'Enter', action: callback, enable: true })
    );

    act(() => {
      const event1 = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event1);

      const event2 = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event2);
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should clean up event listener on unmount', () => {
    const callback = vi.fn();
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useOnKeyPress({ key: 'Escape', action: callback, enable: true })
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
