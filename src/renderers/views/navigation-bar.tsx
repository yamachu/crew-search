import React = require('react');
import { useContext } from 'react';
import { AuthContext } from '../contexts/auth';

export const NavigationBar = () => {
    const auth = useContext(AuthContext);

    return (
        <header>
            <div>
                {auth.isSignedIn ? (
                    <div>{'Logged In!'}</div>
                ) : (
                    <button
                        onClick={(_) => {
                            auth.actions.signIn();
                        }}
                    >
                        login
                    </button>
                )}
            </div>
        </header>
    );
};
