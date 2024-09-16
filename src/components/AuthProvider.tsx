"use client";
import {createContext, Dispatch, FC, ReactNode, useContext, useEffect, useReducer} from 'react';
import {useQuery} from '@tanstack/react-query';
import {currentUser} from "@/helpers/authApi";
import {User} from "@/types";
import Cookies from "js-cookie";
import {Spinner} from "@/components/Spinner";

interface AuthState {
    isAuthenticated: boolean;
    isAccessDenied: boolean;
    user: User | null;
}

type AuthAction = { type: 'LOGIN', user: User | null } | { type: 'LOGOUT' };

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
    dispatch: Dispatch<AuthAction>;
}>({state: initialState, dispatch: () => null});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const {data: user, isError, refetch, isPending} = useQuery<User | null>({
        queryKey: ['currentUser'],
        queryFn: () => currentUser(),
        refetchOnWindowFocus: false,
        retry: false,
    });

    useEffect(() => {
        if (user) {
            dispatch({type: 'LOGIN', user});
            Cookies.set('user', JSON.stringify(user), {secure: true, sameSite: 'strict'});
        } else if (!user || isError) {
            dispatch({type: 'LOGOUT'});
            Cookies.remove('user');
        }
    }, [user, isError, dispatch]);

    useEffect(() => {
        const handleStorageChange = () => {
            const savedUser = Cookies.get('user');
            if (savedUser) {
                refetch()
                    .then(({data}) => {
                        if (data) {
                            dispatch({type: 'LOGIN', user: data});
                            Cookies.set('user', JSON.stringify(user), {secure: true, sameSite: 'strict'});
                        } else {
                            dispatch({type: 'LOGOUT'});
                            Cookies.remove('user');
                        }
                    })
                    .catch(() => {
                        dispatch({type: 'LOGOUT'});
                        Cookies.remove('user');
                    });
            } else {
                dispatch({type: 'LOGOUT'});
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [refetch, dispatch, user]);

    if (isPending) {
        return <Spinner className="reload-spinner"/>;
    }

    return (
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);