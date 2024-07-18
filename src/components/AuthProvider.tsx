"use client";
import {createContext, ReactNode, useContext, useEffect, useReducer} from 'react';
import Cookies from 'js-cookie';

interface AuthState {
    isAuthenticated: boolean;
}

type AuthAction = { type: 'LOGIN' } | { type: 'LOGOUT' };

const initialState: AuthState = {
    isAuthenticated: !!Cookies.get('auth-token'),
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN':
            return {isAuthenticated: true};
        case 'LOGOUT':
            return {isAuthenticated: false};
        default:
            return state;
    }
};

const AuthContext = createContext<{
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}>({state: initialState, dispatch: () => null});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const handleStorageChange = () => {
            const token = Cookies.get('auth-token');
            if (token) {
                dispatch({type: 'LOGIN'});
            } else {
                dispatch({type: 'LOGOUT'});
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
