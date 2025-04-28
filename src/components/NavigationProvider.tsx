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

import { GetArticle, GetCompilation } from '@/types';

type NavigationState = {
  article?: GetArticle;
  compilation?: GetCompilation;
};

type NavigationActions = {
  setArticle: Dispatch<SetStateAction<GetArticle | undefined>>;
  setCompilation: Dispatch<SetStateAction<GetCompilation | undefined>>;
};

const StateContext = createContext<NavigationState>({
  article: {} as GetArticle,
  compilation: {} as GetCompilation,
});

const ActionsContext = createContext<NavigationActions>({
  setArticle: () => null,
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
  const [compilation, setCompilation] = useState<GetCompilation>();

  const stableSetArticle = useCallback<NavigationActions['setArticle']>(
    (value) => setArticle(value),
    [],
  );

  const stableSetCompilation = useCallback<NavigationActions['setCompilation']>(
    (value) => setCompilation(value),
    [],
  );

  const stateValue = useMemo(
    () => ({ article, compilation }),
    [article, compilation],
  );

  const actionsValue = useMemo(
    () => ({
      setArticle: stableSetArticle,
      setCompilation: stableSetCompilation,
    }),
    [stableSetArticle, stableSetCompilation],
  );

  return (
    <ActionsContext.Provider value={actionsValue}>
      <StateContext.Provider value={stateValue}>
        {children}
      </StateContext.Provider>
    </ActionsContext.Provider>
  );
};
