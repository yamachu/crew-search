import * as config from '../credential/firebaseConfig.json';
import { ExtensionMessagePop2Back } from './contracts/message';
import { FirebaseClient } from './services/FirebaseClient';
import { GoogleCalendarClient } from './services/GoogleCalendarClient';

// Todo: When expire access-token, do refresh...
const firebase = new FirebaseClient(config);
let client: GoogleCalendarClient | null = null;

const login = async (response: (val: any) => void) => {
    return firebase
        .signIn()
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
    if (client !== null) {
        const events = await client.FetchEventsInTheDate(payload.calendarId, payload.date);
        response(events);
    } else {
        response({});
    }
};

const fetchSearchUrl = async (response: (val: any) => void) => {
    return firebase
        .fetchSearchUrl()
        .then(([url, token, index]) => {
            response({
                ok: true,
                payload: {
                    url,
                    token,
                    index,
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
