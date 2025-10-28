'use client';
import { useParams } from 'next/navigation';
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getBoolean } from '@/helpers/localStorage';

type NavigationContextType = {
  isFullscreen: boolean;
  setIsFullscreen: Dispatch<SetStateAction<boolean>>;
};

const NavigationContext = createContext<NavigationContextType>({
  isFullscreen: false,
  setIsFullscreen: () => null,
});

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({
  children,
}: {
  readonly children: ReactNode;
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const { articleId } = useParams();

  useEffect(() => {
    if (!articleId) {
      localStorage.removeItem('fullscreen');
    }
    setIsFullscreen(() => getBoolean('fullscreen', false));
  }, [articleId]);

  const stableSetIsFullscreen = useCallback<
    NavigationContextType['setIsFullscreen']
  >((value) => {
    localStorage.setItem('fullscreen', String(value));
    setIsFullscreen(value);
  }, []);

  const navigationValue = useMemo(
    () => ({ isFullscreen, setIsFullscreen: stableSetIsFullscreen }),
    [isFullscreen, stableSetIsFullscreen],
  );

  return (
    <NavigationContext.Provider value={navigationValue}>
      {children}
    </NavigationContext.Provider>
  );
};
