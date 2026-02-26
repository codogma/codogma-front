'use client';
import React, { createContext, useContext, useMemo } from 'react';

interface CompilationContextType {
  isRefetch: boolean;
  resetRefetch: () => void;
}

const CompilationContext = createContext<CompilationContextType>({
  isRefetch: false,
  resetRefetch: () => {},
});

export const useCompilation = () => useContext(CompilationContext);

export const CompilationProvider = ({
  children,
  isRefetch,
  resetRefetch,
}: {
  readonly children: React.ReactNode;
  readonly isRefetch: boolean;
  readonly resetRefetch: () => void;
}) => {
  const value = useMemo(
    () => ({ isRefetch, resetRefetch }),
    [isRefetch, resetRefetch],
  );

  return (
    <CompilationContext.Provider value={value}>
      {children}
    </CompilationContext.Provider>
  );
};
