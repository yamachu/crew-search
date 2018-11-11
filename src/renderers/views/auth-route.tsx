import React = require('react');
import { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';

// https://stackoverflow.com/questions/31815633/what-does-the-error-jsx-element-type-does-not-have-any-construct-or-call
export default (props: { component: typeof React.Component; [key: string]: any }) => {
    const auth = useContext(AuthContext);
    const { component: Component, ...rest } = props;

    return (
        <Route
            render={(p) =>
                auth.props.isSignedIn ? <Component {...p} /> : <Redirect to="/index.html" />
            }
            {...rest}
        />
    );
};
