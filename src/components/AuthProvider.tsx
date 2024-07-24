"use client";
import {createContext, ReactNode, useContext, useEffect, useReducer, useState} from 'react';
import {currentUser} from "@/helpers/authApi";
import {User} from "@/types";

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

type AuthAction = { type: 'LOGIN', user: User } | { type: 'LOGOUT' };

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN':
            return {isAuthenticated: true, user: action.user};
        case 'LOGOUT':
            return {isAuthenticated: false, user: null};
        default:
            return state;
    }
};

const AuthContext = createContext<{
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
    setHasLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}>({
    state: initialState, dispatch: () => null, setHasLoggedIn: () => {
    }
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [loading, setLoading] = useState(true);
    const [hasLoggedIn, setHasLoggedIn] = useState(false);

    useEffect(() => {
        if (!hasLoggedIn) {
            setLoading(false);
            return;
        }

        const handleStorageChange = () => {
            currentUser()
                .then((user) => {
                    if (user) {
                        dispatch({type: 'LOGIN', user});
                    } else {
                        dispatch({type: 'LOGOUT'});
                    }
                })
                .catch(() => {
                    dispatch({type: 'LOGOUT'});
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        handleStorageChange();

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [hasLoggedIn]);

    if (loading) {
        return <div>Loading...</div>; // Можно заменить на компонент загрузки
    }

    return (
        <AuthContext.Provider value={{state, dispatch, setHasLoggedIn}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);