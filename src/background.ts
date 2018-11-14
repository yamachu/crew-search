import * as config from '../credential/firebaseConfig.json';
import {
    ExtensionMessageBack2Pop,
    ExtensionMessagePop2Back,
    FetchCalendarMessage,
    FetchSearchUrlMessage,
    FetchUserMessage,
    IsSignedInMessage,
} from './contracts/message';
import { FirebaseClient } from './services/FirebaseClient';
import { GoogleAPIClient } from './services/GoogleAPIClient';

// Todo: When expire access-token, do refresh...
const firebase = new FirebaseClient(config);
let client: GoogleAPIClient | null = null;

const login = async (response: (val: ExtensionMessageBack2Pop) => void) => {
    return firebase
        .signIn()
        .then(async (result) => {
            client = new GoogleAPIClient((result.credential as any).accessToken);
            response({ ok: true });
        })
        .catch((error) => {
            console.error('Crew-Search Firebase login failed', error);
            response({ ok: false, error });
        });
};

const searchRangedEvents = async (
    payload: {
        calendarId: string;
        date: string;
    },
    response: (val: ExtensionMessageBack2Pop) => void
) => {
    if (client !== null) {
        const events = await client.FetchEventsInTheDate(payload.calendarId, payload.date);
        const res: FetchCalendarMessage = {
            ok: true,
            payload: {
                events,
            },
        };
        response(res);
    } else {
        response({
            ok: false,
        });
    }
};

const fetchSearchUrl = async (response: (val: ExtensionMessageBack2Pop) => void) => {
    return firebase
        .fetchSearchUrl()
        .then(([url, token, index]) => {
            const res: FetchSearchUrlMessage = {
                ok: true,
                payload: {
                    url,
                    token,
                    index,
                },
            };
            response(res);
        })
        .catch((error) => {
            console.error('Crew-Search Fetch Search Url failed', error);
            response({
                ok: false,
                error,
            });
        });
};

const isLoggedIn = async (response: (val: ExtensionMessageBack2Pop) => void) => {
    if (client !== null) {
        client
            .isSignedIn()
            .then((val) => {
                const res: IsSignedInMessage = {
                    ok: true,
                    payload: {
                        result: val,
                    },
                };
                response(res);
            })
            .catch((val) => {
                response({
                    ok: false,
                });
            });
    } else {
        response({
            ok: false,
        });
    }
};

const fetchUser = async (response: (val: ExtensionMessageBack2Pop) => void) => {
    return firebase
        .fetchUser()
        .then((result) => {
            const res: FetchUserMessage = {
                ok: true,
                payload: {
                    user: {
                        displayName: result.displayName ? result.displayName : '',
                        email: result.email ? result.email : '',
                        photoURL: result.photoURL ? result.photoURL : '',
                    },
                },
            };
            response(res);
        })
        .catch((_) => {
            response({
                ok: false,
            });
        });
};

const updateUser = async (
    payload: {
        user: {
            name: string;
            email: string;
            organization: string;
            yomi: string;
        };
    },
    response: (val: ExtensionMessageBack2Pop) => void
) => {
    const user = await firebase.fetchUser();
    const firebaseToken = await user.getIdToken();
    const [url, apiKey] = await firebase.fetchUserUpdateUrl();
    const result = await fetch(`${url}?code=${apiKey}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            // tslint:disable-next-line:quotemark
            "Authorization": `Bearer: ${firebaseToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload.user),
    })
        .then((res) => {
            return res.status === 200;
        })
        .catch((_) => false);

    response({
        ok: result,
    });
};

// 非同期だとtrueを返すっぽい, ref: http://var.blog.jp/archives/52377390.html
chrome.runtime.onMessage.addListener((msg: ExtensionMessagePop2Back, sender, response) => {
    switch (msg.type) {
        case 'LOGIN':
            login(response);
            return true;
        case 'FETCH_CALENDAR':
            searchRangedEvents(msg.payload, response);
            return true;
        case 'FETCH_SEARCH_URL':
            fetchSearchUrl(response);
            return true;
        case 'IS_SIGNED_IN':
            isLoggedIn(response);
            return true;
        case 'FETCH_USER':
            fetchUser(response);
            return true;
        case 'UPDATE_USER':
            updateUser(msg.payload, response);
            return true;
        default:
            response('unknown request');
            break;
    }
});

/*
const runAllSample = async () => {
    const logger = (val: any) => {
        console.dir(val);
    };
    await login(logger);
    await searchRangedEvents(
        {
            calendarId: 'fill this field with your email address',
            date: new Date(),
        },
        logger
    );
    await fetchSearchUrl(logger);
};

runAllSample();
*/
