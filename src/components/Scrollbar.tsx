'use client';
import { ClickScrollPlugin, OverlayScrollbars } from 'overlayscrollbars';
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentProps,
} from 'overlayscrollbars-react';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

OverlayScrollbars.plugin([ClickScrollPlugin]);

type ScrollContextType = {
  instance?: OverlayScrollbars;
};

const ScrollContext = createContext<ScrollContextType>({});

export const Scrollbar = ({
  defer,
  style,
  options,
  children,
  ...props
}: OverlayScrollbarsComponentProps) => {
  const [scrollInstance, setScrollInstance] = useState<OverlayScrollbars>();

  const handleInitialized = useCallback((instance: OverlayScrollbars) => {
    setScrollInstance(instance);
  }, []);

  const scrollContextValue = useMemo(
    () => ({ instance: scrollInstance }),
    [scrollInstance],
  );

  return (
    <ScrollContext.Provider value={scrollContextValue}>
      <OverlayScrollbarsComponent
        defer={defer ?? true}
        options={
          options ?? {
            scrollbars: {
              theme: 'os-theme-light',
              clickScroll: true,
              dragScroll: true,
            },
          }
        }
        className='dark:[&_.os-scrollbar]:os-theme-dark'
        style={style ?? { height: '100vh' }}
        events={{ initialized: handleInitialized }}
        {...props}
      >
        {children}
      </OverlayScrollbarsComponent>
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => useContext(ScrollContext);
