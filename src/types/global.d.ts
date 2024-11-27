export type CustomEventDetail = {
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
};

declare global {
  interface WindowEventMap {
    [eventName: string]: CustomEvent<CustomEventDetail>;
  }
}
