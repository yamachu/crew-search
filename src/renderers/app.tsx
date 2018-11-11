// tslint:disable-next-line:no-implicit-dependencies
import { createMemoryHistory } from 'history';
import React = require('react');
import { useContext, useEffect } from 'react';
import { Route, Router, Switch, withRouter } from 'react-router-dom';
import ApplicationContextProvider from './contexts/app';
import { AuthContext } from './contexts/auth';
import AuthRoute from './views/auth-route';
import DateEvent from './views/date-event';
import NavigationBar from './views/navigation-bar';
import SearchCrew from './views/search-crew';
import Top from './views/top';
import UserInfo from './views/user-info';

const history = createMemoryHistory();

export const App = () => {
    return (
        <>
            <Router history={history}>
                <ApplicationContextProvider>
                    <NavigationBar />
                    <Switch>
                        <RouterContens>
                            <AuthRoute path="/search" component={SearchCrew} />
                            <AuthRoute path="/user/info" component={UserInfo} />
                            <AuthRoute path="/user/:calId/calendar" component={DateEvent} />
                            <Route exact path="/index.html" component={Top} />
                        </RouterContens>
                    </Switch>
                </ApplicationContextProvider>
            </Router>
        </>
    );
};

const Contents = (props: any) => {
    const auth = useContext(AuthContext);

    useEffect(
        () => {
            if (auth.props.isSignedIn) {
                props.history.replace('/search');
            }
        },
        [auth.props.isSignedIn]
    );

    return <>{props.children}</>;
};

const RouterContens = withRouter(Contents);
