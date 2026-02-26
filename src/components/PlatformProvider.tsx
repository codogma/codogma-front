'use client';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';

type Platform = 'mac' | 'other';

interface PlatformContextValue {
  platform: Platform;
}

const PlatformContext = createContext<PlatformContextValue | undefined>(
  undefined,
);

interface PlatformProviderProps {
  readonly children: ReactNode;
  readonly platform: Platform;
}

export function PlatformProvider({
  children,
  platform,
}: PlatformProviderProps) {
  const value = useMemo<PlatformContextValue>(() => ({ platform }), [platform]);

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform(): Platform {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context.platform;
}

export function getSearchShortcut(platform: Platform): string {
  return platform === 'mac' ? '⌘/' : 'Ctrl+/';
}
