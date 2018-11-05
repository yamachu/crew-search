export type ExtensionMessage =
    | {
          type: 'LOGIN';
      }
    // いつか対応する
    | {
          type: 'IS_LOGINED';
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
