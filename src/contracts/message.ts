export type ExtensionMessagePop2Back =
    | {
          type: 'LOGIN';
      }
    | {
          type: 'IS_SIGNEDIN';
      }
    | {
          type: 'FETCH_SEARCH_URL';
      }
    | {
          type: 'FETCH_CALENDAR';
          payload: {
              calendarId: string;
              date: Date;
          };
      };
