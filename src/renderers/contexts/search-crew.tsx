import { createContext, useEffect, useState } from 'react';
import React = require('react');

interface ISearchCrewProps {
    state: [string, any[]];
}

interface ISearchCrewActions {
    setState: (state: [string, any[]]) => void;
}

interface ISearchCrew {
    props: ISearchCrewProps;
    actions: ISearchCrewActions;
}

export const SearchCrewContext = createContext<ISearchCrew>({
    props: {
        state: ['', []],
    },

    actions: {
        setState: (_) => {
            return;
        },
    },
});

export default ({ children }: { children: any }) => {
    const [props, setProps] = useState<ISearchCrewProps>({
        state: ['', []],
    });
    const [actions, setActions] = useState<ISearchCrewActions>({
        setState: (_) => {
            return;
        },
    });

    useEffect(() => {
        setActions({
            setState: (val) => {
                setProps({ state: val });
            },
        });
    }, []);

    return (
        <SearchCrewContext.Provider value={{ props, actions }}>
            {children}
        </SearchCrewContext.Provider>
    );
};
