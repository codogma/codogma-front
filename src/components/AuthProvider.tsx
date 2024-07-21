"use client";
import {createContext, ReactNode, useContext, useEffect, useReducer, useState} from 'react';
import {checkAuth} from "@/helpers/authApi";

interface AuthState {
    isAuthenticated: boolean;
}

type AuthAction = { type: 'LOGIN' } | { type: 'LOGOUT' };

const initialState: AuthState = {
    isAuthenticated: false,
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleStorageChange = () => {
            checkAuth()
                .then((isAuthenticated) => {
                    dispatch({type: isAuthenticated ? 'LOGIN' : 'LOGOUT'});
                })
                .catch((error) => {
                    console.error('Error checking authentication:', error);
                    dispatch({type: 'LOGOUT'});
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        handleStorageChange(); // Проверяем состояние при первом монтировании

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Можете заменить на компонент загрузки
    }

    return (
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);