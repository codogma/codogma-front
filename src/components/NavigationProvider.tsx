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
import { GetArticle, GetCompilation } from '@/types';

type NavigationState = {
  article?: GetArticle;
  toc: TocItem[];
  compilation?: GetCompilation;
};

type NavigationActions = {
  setArticle: Dispatch<SetStateAction<GetArticle | undefined>>;
  setToc: Dispatch<SetStateAction<TocItem[] | []>>;
  setCompilation: Dispatch<SetStateAction<GetCompilation | undefined>>;
};

const StateContext = createContext<NavigationState>({
  article: {} as GetArticle,
  toc: [] as TocItem[],
  compilation: {} as GetCompilation,
});

const ActionsContext = createContext<NavigationActions>({
  setArticle: () => null,
  setToc: () => null,
  setCompilation: () => null,
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
  const [compilation, setCompilation] = useState<GetCompilation>();

  const stableSetArticle = useCallback<NavigationActions['setArticle']>(
    (value) => setArticle(value),
    [],
  );

  const stableSetToc = useCallback<NavigationActions['setToc']>(
    (value) => setToc(value),
    [],
  );

  const stableSetCompilation = useCallback<NavigationActions['setCompilation']>(
    (value) => setCompilation(value),
    [],
  );

  const stateValue = useMemo(
    () => ({ article, toc, compilation }),
    [article, toc, compilation],
  );

  const actionsValue = useMemo(
    () => ({
      setArticle: stableSetArticle,
      setToc: stableSetToc,
      setCompilation: stableSetCompilation,
    }),
    [stableSetArticle, stableSetCompilation, stableSetToc],
  );

  return (
    <ActionsContext.Provider value={actionsValue}>
      <StateContext.Provider value={stateValue}>
        {children}
      </StateContext.Provider>
    </ActionsContext.Provider>
  );
};
