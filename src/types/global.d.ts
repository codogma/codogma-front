import { ParsedSearchQuery } from '@/utils/parseSearchQuery';

export type CustomEventDetail = {
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
};

export type SearchEventDetail = {
  query: string;
  parsed: ParsedSearchQuery;
};

declare global {
  interface WindowEventMap {
    [eventName: string]: CustomEvent<CustomEventDetail | SearchEventDetail>;
    /** Event dispatched when search is performed via SearchDialog */
    performSearch: CustomEvent<SearchEventDetail>;
    /** Event dispatched when search or hash changes */
    searchOrHashChange: Event;
  }
}

// Export to make this a module
export {};
