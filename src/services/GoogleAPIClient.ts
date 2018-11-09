export class GoogleAPIClient {
    private accessToken: string;
    private calendarEndPoint = 'https://www.googleapis.com/calendar/v3';

    constructor(token: string) {
        this.accessToken = token;
    }

    public async FetchEventsInTheDate(calendarId: string, date: Date) {
        return this.FetchEvents(calendarId, {
            ...this.getRangedTime(date),
        });
    }

    public async isSignedIn(): Promise<boolean> {
        return fetch(
            `https://www.googleapis.com/oauth2/v2/tokeninfo?access_token=${this.accessToken}`
        )
            .then((res) => res.status === 200)
            .catch((_) => false);
    }

    private async FetchEvents(calendarId: string, options?: object) {
        if (calendarId.indexOf('@') > 0) {
            calendarId = encodeURIComponent(calendarId);
        }
        let query = '';
        if (options) {
            query =
                '?' +
                Object.keys(options)
                    .map((k) => {
                        if (['timeMax', 'timeMin'].indexOf(k) === -1) {
                            return `${k}=${encodeURIComponent((options as any)[k])}`;
                        } else {
                            return `${k}=${(options as any)[k]}`;
                        }
                    })
                    .join('&');
        }

        return fetch(`${this.calendarEndPoint}/calendars/${calendarId}/events${query}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        }).then((res) => res.json());
    }

    private getRangedTime(currentDate: Date) {
        const today = new Date(
            `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`
        );
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return {
            timeMax: tomorrow.toISOString(),
            timeMin: today.toISOString(),
        };
    }
}
