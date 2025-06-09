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
  const { articleId } = useParams();

  useEffect(() => {
    if (!articleId) {
      localStorage.removeItem('fullscreen');
    }
    setIsFullscreen(() => getBoolean('fullscreen', false));
  }, [articleId]);

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
  >((value) => {
    localStorage.setItem('fullscreen', String(value));
    setIsFullscreen(value);
  }, []);

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
