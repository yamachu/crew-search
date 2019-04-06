import { User } from './user';

export type ExtensionMessagePop2Back =
    | {
          type: 'LOGIN';
      }
    | {
          type: 'IS_SIGNED_IN';
      }
    | {
          type: 'FETCH_SEARCH_URL';
      }
    | {
          type: 'FETCH_CALENDAR';
          payload: {
              calendarId: string;
              date: string; // `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`
          };
      }
    | {
          type: 'FETCH_USER';
      }
    | {
          type: 'UPDATE_USER';
          payload: {
              user: {
                  name: string;
                  email: string;
                  organization: string;
                  yomi: string;
              };
          };
      };

export interface ExtensionMessageBack2Pop {
    ok: boolean;
    payload?: any;
    error?: any;
}

export interface IsSignedInMessage extends ExtensionMessageBack2Pop {
    payload: {
        result: boolean;
    };
}

export interface FetchSearchUrlMessage extends ExtensionMessageBack2Pop {
    payload: {
        url: string;
        token: string;
        index: string;
    };
}

// tslint:disable-next-line:no-empty-interface
export interface LoginMessage extends ExtensionMessageBack2Pop {
    //
}

export interface FetchCalendarMessage extends ExtensionMessageBack2Pop {
    payload: {
        events: any; // Todo: 型付け
    };
}

export interface FetchUserMessage extends ExtensionMessageBack2Pop {
    payload: {
        user: User;
    };
}

// tslint:disable-next-line:no-empty-interface
export interface UpdateUserMessage extends ExtensionMessageBack2Pop {
    //
}
