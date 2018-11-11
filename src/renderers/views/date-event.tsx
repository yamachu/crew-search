import { IconButton, ListItemSecondaryAction } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import DateRangeIcon from '@material-ui/icons/DateRange';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
// tslint:disable-next-line:no-implicit-dependencies
import { History } from 'history';
import { useEffect, useState } from 'react';
import React = require('react');
import { match, withRouter } from 'react-router-dom';
import { ExtensionMessagePop2Back, FetchCalendarMessage } from '../../contracts/message';
import DateEventWrapper, {
    FlexDiv,
    GrowingCenteringTypography,
    WrappedTypography,
} from '../styles/date-event';

export const DateEvent = (props: { history: History; match: match; [key: string]: any }) => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState<{ items: any[] }>({ items: [] });

    useEffect(
        () => {
            const message: ExtensionMessagePop2Back = {
                type: 'FETCH_CALENDAR',
                payload: {
                    calendarId: (props.match.params as any).calId,
                    date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
                },
            };
            chrome.runtime.sendMessage(message, (response: FetchCalendarMessage) => {
                if (!response.ok) {
                    console.warn('Not Authrorized or ...', response);
                } else {
                    setEvents(response.payload.events);
                }
            });
        },
        [date]
    );

    return (
        <DateEventWrapper>
            <DateSwitcher {...{ state: { date }, actions: { setDate } }} />

            <List>{events.items.map(EventItemCell)}</List>
        </DateEventWrapper>
    );
};

const DateSwitcher = (props: {
    state: {
        date: Date;
    };
    actions: {
        setDate: (d: Date) => void;
    };
}) => {
    const date = props.state.date;
    const setDate = props.actions.setDate;

    const dateUpdater = (n: number) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + n);
        setDate(newDate);
    };

    return (
        <FlexDiv>
            <Button size="small" onClick={() => dateUpdater(-1)}>
                <KeyboardArrowLeft />
                Back
            </Button>
            <GrowingCenteringTypography variant={'h6'}>{`${date.getFullYear()} ${date.getMonth() +
                1} / ${date.getDate()}`}</GrowingCenteringTypography>
            <Button size="small" onClick={() => dateUpdater(1)}>
                Next
                <KeyboardArrowRight />
            </Button>
        </FlexDiv>
    );
};

const EventItemCell = (event: any, _: number) => {
    const rangeDate = getShowDateString(event);
    return (
        <ListItem key={event.id}>
            <div style={{ width: '100%' }}>
                <WrappedTypography variant={'body1'} gutterBottom>
                    {event.summary}
                </WrappedTypography>
                <WrappedTypography variant={'body2'} color={'textSecondary'}>
                    {event.location}
                </WrappedTypography>
                <Typography variant={'body2'} color={'textSecondary'}>
                    {rangeDate}
                </Typography>
            </div>
            <ListItemSecondaryAction>
                <IconButton
                    onClick={() => {
                        const url = event.htmlLink;
                        window.open(url, '_blank');
                    }}
                >
                    <DateRangeIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

const getShowDateString = ({ start, end }: { start: any; end: any }) => {
    if (start.dateTime === undefined) {
        if (start.date === end.date) {
            return start.date;
        } else {
            return `${start.date} ~ ${end.date}`;
        }
    } else {
        return `${new Date(start.dateTime).toLocaleString()} ~ ${new Date(
            end.dateTime
        ).toLocaleString()}`;
    }
};

export default withRouter(DateEvent);
