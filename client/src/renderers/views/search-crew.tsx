import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import AssignmentIcon from '@material-ui/icons/Assignment';
import EventNoteIcon from '@material-ui/icons/EventNote';
import SearchIcon from '@material-ui/icons/Search';
// tslint:disable-next-line:no-implicit-dependencies
import { History } from 'history';
import { useContext, useEffect, useRef, useState } from 'react';
import React = require('react');
import { withRouter } from 'react-router-dom';
import { from, fromEvent, of, zip } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ExtensionMessagePop2Back, FetchSearchUrlMessage } from '../../contracts/message';
import { AzureSearchService } from '../../services/AzureSearchClient';
import { AuthContext } from '../contexts/auth';
import { SearchCrewContext } from '../contexts/search-crew';
import SearchCrewWrapper, { FlexDiv, IconCentering } from '../styles/search-crew';

const SearchCrew = (props: { history: History; [key: string]: any }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const pasteBoardRef = useRef<HTMLInputElement>(null);
    const [searchClient, setSearchClient] = useState<AzureSearchService | null>(null);
    const [predictions, setPredictions] = useState<any[]>([]);
    const auth = useContext(AuthContext);
    const scContext = useContext(SearchCrewContext);

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

    useEffect(() => {
        if (!auth.props.isSignedIn) {
            return;
        }
        initalizeClient();
        inputRef.current!.focus();
        const state = scContext.props.state;
        inputRef.current!.value = state[0];
        setPredictions(state[1]);
    }, []);
    useEffect(
        () => {
            if (searchClient === null) {
                return;
            }
            const disposable = fromEvent(inputRef.current!, 'input')
                .pipe(
                    debounceTime(500),
                    switchMap((v) =>
                        zip(
                            of((v.target as any).value as string),
                            from(searchClient!.searchUsers((v.target as any).value))
                        )
                    )
                )
                .subscribe(([form, predict]) => {
                    setPredictions(form === '' ? [] : predict);
                    scContext.actions.setState([form, predict]);
                });
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
            inputRef.current!.focus();
        },
        [auth.props.isSignedIn]
    );

    const copyToClipboard = (value: string) => {
        pasteBoardRef.current!.value = value;
        pasteBoardRef.current!.select();
        document.execCommand('copy');
        pasteBoardRef.current!.value = '';
    };

    return (
        <SearchCrewWrapper>
            <FlexDiv>
                <IconCentering>
                    <SearchIcon />
                </IconCentering>
                <TextField
                    placeholder={'search query, nickname, email, etc...'}
                    margin={'dense'}
                    inputRef={inputRef}
                    fullWidth
                />
                <input ref={pasteBoardRef} tabIndex={-1} hidden style={{ width: 1, height: 1 }} />
            </FlexDiv>

            {/* Todo: いい感じの計算 */}
            <List style={{ maxHeight: 279, overflow: 'auto' }}>
                {predictions.map((v) => {
                    return (
                        <ListItem key={v.email} dense>
                            <ListItemText
                                primary={v.name}
                                secondary={v.email}
                                key={v.email}
                                onClick={() => props.history.push('/user/info', { user: v })}
                            />
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => copyToClipboard(v.email)}>
                                    <AssignmentIcon fontSize={'small'} />
                                </IconButton>
                                <IconButton
                                    onClick={() => {
                                        props.history.push(`/user/${v.email}/calendar`);
                                    }}
                                >
                                    <EventNoteIcon fontSize={'small'} />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
        </SearchCrewWrapper>
    );
};

export default withRouter(SearchCrew);
