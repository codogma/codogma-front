import { useEffect } from 'react';

export function useEventListener<T extends Event = Event>(
  eventName: string,
  handler: (event: T) => void,
) {
  useEffect(() => {
    const eventListener = (event: Event) => {
      handler(event as T);
    };
    window.addEventListener(eventName, eventListener);
    return () => {
      window.removeEventListener(eventName, eventListener);
    };
  }, [eventName, handler]);
}
