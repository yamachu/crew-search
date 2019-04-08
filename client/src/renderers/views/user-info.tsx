import Typography from '@material-ui/core/Typography';
import React = require('react');
import { withRouter } from 'react-router-dom';
import UserInfoWrapper from '../styles/user-info';

const UserInfo = (props: {
    location: {
        state: {
            user: any;
        };
    };
    [key: string]: any;
}) => {
    return (
        <UserInfoWrapper>
            <Typography style={{ wordBreak: 'break-all' }}>
                {props.location.state.user.name}
            </Typography>
            <Typography style={{ wordBreak: 'break-all' }} color={'textSecondary'}>
                {props.location.state.user.email}
            </Typography>
            <Typography style={{ wordBreak: 'break-all' }} component={'p'}>
                {props.location.state.user.organization}
            </Typography>
            <Typography component={'p'}>{props.location.state.user.yomi}</Typography>
        </UserInfoWrapper>
    );
};

export default withRouter(UserInfo);
