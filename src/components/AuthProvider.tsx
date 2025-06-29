'use client';
import { Client } from '@stomp/stompjs';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

import { Spinner } from '@/components/Spinner';
import { currentUser, refreshToken } from '@/helpers/authApi';
import { devConsoleError, devConsoleInfo } from '@/helpers/devConsoleLogs';
import {
  connectPrivateWebSocket,
  connectPublicWebSocket,
  disconnectPrivateWebSocket,
} from '@/helpers/notificationAPI';
import { useEventListener } from '@/helpers/useEventListener';
import { GetUserDTO } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  isAccessDenied: boolean;
  user: GetUserDTO | undefined;
}

type AuthAction =
  | { type: 'LOGIN'; user: GetUserDTO | undefined }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  isAuthenticated: false,
  isAccessDenied: false,
  user: undefined,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        isAuthenticated: true,
        isAccessDenied: false,
        user: action.user,
      };
    case 'LOGOUT':
      return { isAuthenticated: false, isAccessDenied: false, user: undefined };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}>({ state: initialState, dispatch: () => null });

interface AuthProviderProps {
  readonly children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const saved = Cookies.get('user');
  let parsed: GetUserDTO | undefined;

  if (saved && saved !== 'undefined') {
    try {
      parsed = JSON.parse(saved);
    } catch (e) {
      devConsoleError('Ошибка парсинга user cookie:', e);
      parsed = undefined;
    }
  }
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: Boolean(parsed),
    isAccessDenied: false,
    user: parsed,
  });
  const publicClientRef = useRef<Client>();

  useEffect(() => {
    // Всегда поддерживаем публичное подключение
    publicClientRef.current = connectPublicWebSocket();

    return () => {
      if (publicClientRef?.current?.active) {
        publicClientRef.current?.deactivate();
      }
    };
  }, []);

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        if (state.isAuthenticated) {
          await connectPrivateWebSocket();
          devConsoleInfo('Private connection established');
        } else {
          await disconnectPrivateWebSocket();
          devConsoleInfo('Private connection closed');
        }
      } catch (error) {
        devConsoleError('Connection error:', error);
        dispatch({ type: 'LOGOUT' });
      }
    };

    const timeoutId = setTimeout(handleAuthChange, 500);
    return () => clearTimeout(timeoutId);
  }, [state.isAuthenticated]);

  useEventListener('storage', async () => {
    const savedUser = Cookies.get('user');
    if (!savedUser && publicClientRef?.current?.active) {
      await disconnectPrivateWebSocket();
    }
  });

  const {
    data: user,
    isError: hasCurrentUserError,
    refetch,
    isPending,
  } = useQuery<GetUserDTO>({
    queryKey: ['currentUser'],
    queryFn: () => currentUser(),
    refetchOnWindowFocus: false,
  });

  const { isError: hasRefreshTokenError } = useQuery<void>({
    queryKey: ['refreshToken'],
    queryFn: () => refreshToken(),
    staleTime: 1000 * 60 * 10,
    refetchInterval: 1000 * 60 * 15,
  });

  useEffect(() => {
    const savedUser = Cookies.get('user');
    if (savedUser) {
      dispatch({ type: 'LOGIN', user });
      Cookies.set('user', JSON.stringify(user), {
        secure: true,
        sameSite: 'strict',
      });
    } else if (!user || hasCurrentUserError || hasRefreshTokenError) {
      dispatch({ type: 'LOGOUT' });
      Cookies.remove('user');
    }
  }, [user, hasCurrentUserError, hasRefreshTokenError, dispatch]);

  useEventListener('storage', () => {
    const savedUser = Cookies.get('user');
    if (savedUser) {
      refetch()
        .then(({ data }) => {
          if (data) {
            dispatch({ type: 'LOGIN', user: data });
            Cookies.set('user', JSON.stringify(user), {
              secure: true,
              sameSite: 'strict',
            });
          } else {
            dispatch({ type: 'LOGOUT' });
            Cookies.remove('user');
          }
        })
        .catch(() => {
          dispatch({ type: 'LOGOUT' });
          Cookies.remove('user');
        });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  });

  if (isPending) {
    return <Spinner className='reload-spinner' />;
  }

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
