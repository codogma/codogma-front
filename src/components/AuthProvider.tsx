"use client";
import {createContext, ReactNode, useContext, useEffect, useReducer, useState} from 'react';
import {currentUser} from "@/helpers/authApi";
import {User} from "@/types";
import Cookies from 'js-cookie';

interface AuthState {
    isAuthenticated: boolean;
    isAccessDenied: boolean;
    user: User | null;
}

type AuthAction = { type: 'LOGIN', user: User } | { type: 'LOGOUT' } | { type: 'ACCESS_DENIED', user: User };

const initialState: AuthState = {
    isAuthenticated: false,
    isAccessDenied: false,
    user: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN':
            return {isAuthenticated: true, isAccessDenied: false, user: action.user};
        case 'LOGOUT':
            return {isAuthenticated: false, isAccessDenied: false, user: null};
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
            // const savedUser = Cookies.get('user');
            // if (savedUser) {
            currentUser()
                .then((user) => {
                    if (user) {
                        dispatch({type: 'LOGIN', user});
                        Cookies.set('user', JSON.stringify(user), {secure: true, sameSite: 'strict'});
                    } else {
                        dispatch({type: 'LOGOUT'});
                        Cookies.remove('user');
                    }
                })
                .catch(() => {
                    dispatch({type: 'LOGOUT'});
                    Cookies.remove('user');
                }).finally(() => setLoading(false));
            // } else {
            //     dispatch({type: 'LOGOUT'});
            //     setLoading(false);
            // }
        };

        handleStorageChange();
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Можно заменить на компонент загрузки
    }

    return (
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);