import { useEffect, useRef, useState } from 'react';
import React = require('react');
import { from, fromEvent } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ExtensionMessagePop2Back, FetchSearchUrlMessage } from '../../contracts/message';
import { AzureSearchService } from '../../services/AzureSearchClient';

export const SearchCrew = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchClient, setSearchClient] = useState<AzureSearchService | null>(null);

    useEffect(() => {
        const message: ExtensionMessagePop2Back = {
            type: 'FETCH_SEARCH_URL',
        };
        chrome.runtime.sendMessage(message, (response: FetchSearchUrlMessage) => {
            if (!response.ok) {
                console.error('Not Authrorized or ...', response);
            } else {
                const client = new AzureSearchService({
                    url: response.payload.url,
                    key: response.payload.token,
                });
                client.setIndex(response.payload.index);
                setSearchClient(client);
            }
        });
    }, []);

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
                .subscribe((v) => console.log(v));
            return () => {
                disposable.unsubscribe();
            };
        },
        [searchClient]
    );

    return <input ref={inputRef} />;
};
