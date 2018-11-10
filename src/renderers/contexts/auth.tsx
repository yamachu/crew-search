import { createContext, useEffect, useState } from 'react';
import React = require('react');
import { ExtensionMessagePop2Back, IsSignedInMessage, LoginMessage } from '../../contracts/message';

interface IAuth {
    isSignedIn: boolean;
    actions: {
        signIn: () => void;
    };
}

export const AuthContext = createContext<IAuth>({
    isSignedIn: false,
    actions: {
        signIn: () => {
            return;
        },
    },
});

export const AuthManager = ({ children }: { children: any }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [actions, setActions] = useState({
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

    return <AuthContext.Provider value={{ isSignedIn, actions }}>{children}</AuthContext.Provider>;
};
