import { useEffect, useRef } from 'react';

const INACTIVITY_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours
const LAST_ACTIVITY_KEY = 'lastActivityAt';

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'click',
];

export const useInactivityTimeout = (
  onTimeout: () => void,
  isActive: boolean,
) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      return;
    }

    // Check persisted last activity timestamp to handle page reloads/reopens
    const stored = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (stored !== null) {
      const lastActivity = Number(stored);
      if (!Number.isNaN(lastActivity)) {
        const elapsed = Date.now() - lastActivity;
        if (elapsed >= INACTIVITY_TIMEOUT_MS) {
          onTimeoutRef.current();
          return;
        }
      }
    }

    const resetTimer = () => {
      localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        onTimeoutRef.current();
      }, INACTIVITY_TIMEOUT_MS);
    };

    resetTimer();

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isActive]);
};
