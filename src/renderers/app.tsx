import React = require('react');
import { AuthManager } from './contexts/auth';
import { NavigationBar } from './views/navigation-bar';
import { SearchCrew } from './views/search-crew';

export const App = () => {
    return (
        <>
            {/* Router */}
            <AuthManager>
                <NavigationBar />

                <SearchCrew />
            </AuthManager>
            {/* /Router */}
        </>
    );
};
