'use client';
import React, { createContext, useContext } from 'react';

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
  return (
    <CompilationContext.Provider value={{ isRefetch, resetRefetch }}>
      {children}
    </CompilationContext.Provider>
  );
};
