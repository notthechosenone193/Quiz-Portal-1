import { useRef, useEffect, useState } from 'react';

export function useTimer(initialSeconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const onExpireRef = useRef(onExpire);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setRemaining(initialSeconds);
    hasExpiredRef.current = false;

    // Pure state transition only — no side effects here. React's StrictMode
    // deliberately double-invokes updater functions to catch impurity, so calling
    // onExpire() from inside this updater (as this used to) fires it twice per
    // real expiry, causing duplicate answer submissions.
    const interval = setInterval(() => {
      setRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [initialSeconds]);

  // The actual expiry side effect lives in its own effect, guarded so it fires exactly once.
  useEffect(() => {
    if (remaining === 0 && !hasExpiredRef.current) {
      hasExpiredRef.current = true;
      onExpireRef.current();
    }
  }, [remaining]);

  return remaining;
}
