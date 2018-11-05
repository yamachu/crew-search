import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import * as config from '../credential/firebaseConfig.json';
import { GoogleCalendarClient } from './GoogleCalendarClient';
import { ExtensionMessage } from './message';

// Todo: When expire access-token, do refresh...

let client: GoogleCalendarClient;

firebase.initializeApp(config);

const login = async (response: (val: any) => void) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope(config.scopes.join(' '));
    return firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (result) => {
            client = new GoogleCalendarClient((result.credential as any).accessToken);
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
        date: Date;
    },
    response: (val: any) => void
) => {
    const events = await client.FetchEventsInTheDate(payload.calendarId, payload.date);
    response(events);
};

const fetchSearchUrl = async (response: (val: any) => void) => {
    return firebase
        .database()
        .ref('/consts')
        .once('value')
        .then((snapshot) => {
            Promise.all([
                snapshot.ref
                    .child('url')
                    .once('value')
                    .then((s) => s.val()),
                snapshot.ref
                    .child('token')
                    .once('value')
                    .then((s) => s.val()),
            ])
                .then(([url, token]) => {
                    response({
                        ok: true,
                        payload: {
                            url,
                            token,
                        },
                    });
                })
                .catch((error) => {
                    console.error('Crew-Search Fetch Search Url failed', error);
                    response({
                        ok: false,
                        error,
                    });
                });
        });
};

// 非同期だとtrueを返すっぽい, ref: http://var.blog.jp/archives/52377390.html
chrome.runtime.onMessage.addListener((msg: ExtensionMessage, sender, response) => {
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
