import { createContext, useEffect, useState } from 'react';
import React = require('react');
import {
    ExtensionMessagePop2Back,
    FetchUserMessage,
    IsSignedInMessage,
    LoginMessage,
} from '../../contracts/message';
import { User } from '../../contracts/user';

interface IAuthProps {
    isSignedIn: boolean;
    user: User | null;
}

interface IAuthActions {
    signIn: () => void;
}

interface IAuth {
    props: IAuthProps;
    actions: IAuthActions;
}

export const AuthContext = createContext<IAuth>({
    props: {
        isSignedIn: false,
        user: null,
    },

    actions: {
        signIn: () => {
            return;
        },
    },
});

export const AuthManager = ({ children }: { children: any }) => {
    const [props, setProps] = useState<IAuthProps>({
        isSignedIn: false,
        user: null,
    });
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [actions, setActions] = useState<IAuthActions>({
        signIn: () => {
            return;
        },
    });

    useEffect(() => {
        const signInCheck: ExtensionMessagePop2Back = {
            type: 'IS_SIGNED_IN',
        };
        chrome.runtime.sendMessage(signInCheck, (response: IsSignedInMessage) => {
            if (!response.ok) {
                console.warn('SignIn check failed', response);
            } else {
                setIsSignedIn(response.payload.result);
            }
        });

        const signIn = () => {
            const message: ExtensionMessagePop2Back = {
                type: 'LOGIN',
            };
            chrome.runtime.sendMessage(message, (response: LoginMessage) => {
                if (!response.ok) {
                    console.warn('Login failed', response);
                } else {
                    setIsSignedIn(response.ok);
                }
            });
        };

        setActions({
            signIn,
        });
    }, []);

    useEffect(
        () => {
            const message: ExtensionMessagePop2Back = {
                type: 'FETCH_USER',
            };
            chrome.runtime.sendMessage(message, (response: FetchUserMessage) => {
                if (!response.ok) {
                    console.warn('FetchUser failed', response);
                } else {
                    setUser(response.payload.user);
                }
            });
        },
        [isSignedIn]
    );

    useEffect(
        () => {
            console.log('effect!', isSignedIn, user);
            setProps({
                isSignedIn,
                user,
            });
        },
        [isSignedIn, user]
    );

    return <AuthContext.Provider value={{ props, actions }}>{children}</AuthContext.Provider>;
};
