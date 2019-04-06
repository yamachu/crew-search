import React = require('react');
import AuthContextProvider from './auth';
import SearchCrewContextProvider from './search-crew';

export default ({ children }: { children: any }) => {
    return (
        <AuthContextProvider>
            <SearchCrewContextProvider>{children}</SearchCrewContextProvider>
        </AuthContextProvider>
    );
};
