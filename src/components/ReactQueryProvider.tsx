'use client';

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import React, { ReactNode, useMemo, useState } from 'react';

import { getQueryClient } from '@/lib/react-query';

const PERSIST_KEY = 'CODOGMA_REACT_QUERY_CACHE';
const MAX_AGE_MS = 1000 * 60 * 60 * 6; // 6 часов

export const ReactQueryProvider = ({
  children,
}: {
  readonly children: ReactNode;
}) => {
  // QueryClient должен быть стабильным в рамках жизненного цикла компонента
  // (иначе кеш будет "сбрасываться" и эффект persistence теряется). [page:0]
  const [queryClient] = useState(() => getQueryClient());

  const persister = useMemo(() => {
    // На всякий случай: localStorage может быть недоступен (privacy mode/SSR edge-cases)
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;

      // В документации persister ожидает async-интерфейс, но допускает MaybePromise,
      // поэтому window.localStorage подходит по сигнатуре getItem/setItem/removeItem. [page:2]
      return createAsyncStoragePersister({
        storage: window.localStorage,
        key: PERSIST_KEY,
        throttleTime: 1500, // меньше записей в localStorage -> меньше IO/джанка на UI [page:2]
      });
    } catch {
      return null;
    }
  }, []);

  // Fallback: если persister недоступен — работаем как раньше.
  if (!persister) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: MAX_AGE_MS,
        // buster нужен, чтобы сбрасывать старый кеш при деплое/изменении схем данных. [page:1]
        buster: process.env.NEXT_PUBLIC_BUILD_ID ?? 'dev',
        // Пишем в localStorage только "успешные" запросы, чтобы не сохранять ошибки/лоадинги. [page:0]
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.state.status === 'success',
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
