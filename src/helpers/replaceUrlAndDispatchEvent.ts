import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { dispatchCustomEvent } from './dispatchCustomEvent';

export const replaceUrlAndDispatchEvent = (
  router: AppRouterInstance,
  url: string,
) => {
  router.replace(url);
  if (window.location.hash) {
    window.history.replaceState(null, '', url);
  }
  dispatchCustomEvent('hashchange', {
    message: '',
    severity: 'success',
  });
};
