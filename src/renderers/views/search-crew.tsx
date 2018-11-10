import { useContext, useEffect, useRef, useState } from 'react';
import React = require('react');
import { from, fromEvent } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ExtensionMessagePop2Back, FetchSearchUrlMessage } from '../../contracts/message';
import { AzureSearchService } from '../../services/AzureSearchClient';
import { AuthContext } from '../contexts/auth';

export const SearchCrew = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchClient, setSearchClient] = useState<AzureSearchService | null>(null);
    const [predictions, setPredictions] = useState<any[]>([]);
    const auth = useContext(AuthContext);

    const initalizeClient = () => {
        const message: ExtensionMessagePop2Back = {
            type: 'FETCH_SEARCH_URL',
        };
        chrome.runtime.sendMessage(message, (response: FetchSearchUrlMessage) => {
            if (!response.ok) {
                console.warn('Not Authrorized or ...', response);
            } else {
                const client = new AzureSearchService({
                    url: response.payload.url,
                    key: response.payload.token,
                });
                client.setIndex(response.payload.index);
                setSearchClient(client);
            }
        });
    };

    useEffect(initalizeClient, []);
    useEffect(
        () => {
            if (searchClient === null) {
                return;
            }
            const disposable = fromEvent(inputRef.current!, 'input')
                .pipe(
                    debounceTime(500),
                    switchMap((v) => from(searchClient!.searchUsers((v.target as any).value)))
                )
                .subscribe((v) => setPredictions(v));
            return () => {
                disposable.unsubscribe();
            };
        },
        [searchClient]
    );
    useEffect(
        () => {
            if (!auth.props.isSignedIn) {
                return;
            }
            if (searchClient !== null) {
                return;
            }
            initalizeClient();
        },
        [auth.props.isSignedIn]
    );

    return (
        <>
            <input ref={inputRef} />
            <ul>
                {predictions.map((v) => {
                    return <li key={v.email}>{`${v.name} / ${v.email}`}</li>;
                })}
            </ul>
        </>
    );
};
