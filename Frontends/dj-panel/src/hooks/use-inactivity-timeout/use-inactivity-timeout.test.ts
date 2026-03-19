import { act, renderHook } from '@testing-library/react';
import { useInactivityTimeout } from './use-inactivity-timeout';

describe('useInactivityTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls onTimeout after 2 hours of inactivity when active', () => {
    const onTimeout = jest.fn();

    renderHook(() => useInactivityTimeout(onTimeout, true));

    act(() => {
      jest.advanceTimersByTime(2 * 60 * 60 * 1000);
    });

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('does not call onTimeout before 2 hours have passed', () => {
    const onTimeout = jest.fn();

    renderHook(() => useInactivityTimeout(onTimeout, true));

    act(() => {
      jest.advanceTimersByTime(2 * 60 * 60 * 1000 - 1);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('does not call onTimeout when not active', () => {
    const onTimeout = jest.fn();

    renderHook(() => useInactivityTimeout(onTimeout, false));

    act(() => {
      jest.advanceTimersByTime(2 * 60 * 60 * 1000);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('resets timer on user activity', () => {
    const onTimeout = jest.fn();

    renderHook(() => useInactivityTimeout(onTimeout, true));

    // Advance 1 hour, then simulate activity
    act(() => {
      jest.advanceTimersByTime(60 * 60 * 1000);
      window.dispatchEvent(new MouseEvent('mousemove'));
    });

    // Advance another 1 hour and 59 minutes (less than 2h from last activity)
    act(() => {
      jest.advanceTimersByTime(2 * 60 * 60 * 1000 - 1);
    });

    expect(onTimeout).not.toHaveBeenCalled();

    // Advance 1 more ms to complete 2 hours from last activity
    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('clears timer when isActive becomes false', () => {
    const onTimeout = jest.fn();

    const { rerender } = renderHook(
      ({ isActive }: { isActive: boolean }) =>
        useInactivityTimeout(onTimeout, isActive),
      { initialProps: { isActive: true } },
    );

    act(() => {
      jest.advanceTimersByTime(60 * 60 * 1000);
    });

    rerender({ isActive: false });

    act(() => {
      jest.advanceTimersByTime(2 * 60 * 60 * 1000);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('starts timer when isActive becomes true', () => {
    const onTimeout = jest.fn();

    const { rerender } = renderHook(
      ({ isActive }: { isActive: boolean }) =>
        useInactivityTimeout(onTimeout, isActive),
      { initialProps: { isActive: false } },
    );

    rerender({ isActive: true });

    act(() => {
      jest.advanceTimersByTime(2 * 60 * 60 * 1000);
    });

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('listens to all activity events and resets timer', () => {
    const onTimeout = jest.fn();
    const events: (keyof WindowEventMap)[] = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'click',
    ];

    renderHook(() => useInactivityTimeout(onTimeout, true));

    events.forEach((eventName) => {
      act(() => {
        jest.advanceTimersByTime(60 * 60 * 1000);
        window.dispatchEvent(new Event(eventName));
      });
    });

    // After all those activity resets, the 2h timer hasn't expired
    act(() => {
      jest.advanceTimersByTime(2 * 60 * 60 * 1000 - 1);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });
});
