'use client';
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { TocItem } from '@/helpers/parseToc';
import { GetArticle } from '@/types';

type NavigationState = {
  article?: GetArticle;
  toc: TocItem[];
  isFullscreen: boolean;
};

type NavigationActions = {
  setArticle: Dispatch<SetStateAction<GetArticle | undefined>>;
  setToc: Dispatch<SetStateAction<TocItem[] | []>>;
  setIsFullscreen: Dispatch<SetStateAction<boolean>>;
};

const StateContext = createContext<NavigationState>({
  article: {} as GetArticle,
  toc: [] as TocItem[],
  isFullscreen: false,
});

const ActionsContext = createContext<NavigationActions>({
  setArticle: () => null,
  setToc: () => null,
  setIsFullscreen: () => null,
});

export const useNavigationState = () => useContext(StateContext);
export const useNavigationActions = () => useContext(ActionsContext);

export const NavigationProvider = ({
  children,
}: {
  readonly children: ReactNode;
}) => {
  const [article, setArticle] = useState<GetArticle>();
  const [toc, setToc] = useState<TocItem[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const stableSetArticle = useCallback<NavigationActions['setArticle']>(
    (value) => setArticle(value),
    [],
  );

  const stableSetToc = useCallback<NavigationActions['setToc']>(
    (value) => setToc(value),
    [],
  );

  const stableSetIsFullscreen = useCallback<
    NavigationActions['setIsFullscreen']
  >((value) => setIsFullscreen(value), []);

  const stateValue = useMemo(
    () => ({ article, toc, isFullscreen }),
    [article, toc, isFullscreen],
  );

  const actionsValue = useMemo(
    () => ({
      setArticle: stableSetArticle,
      setToc: stableSetToc,
      setIsFullscreen: stableSetIsFullscreen,
    }),
    [stableSetArticle, stableSetIsFullscreen, stableSetToc],
  );

  return (
    <ActionsContext.Provider value={actionsValue}>
      <StateContext.Provider value={stateValue}>
        {children}
      </StateContext.Provider>
    </ActionsContext.Provider>
  );
};
