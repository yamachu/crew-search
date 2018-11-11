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
            <Typography>{props.location.state.user.name}</Typography>
            <Typography color={'textSecondary'}>{props.location.state.user.email}</Typography>
            <Typography component={'p'}>{props.location.state.user.yomi}</Typography>
        </UserInfoWrapper>
    );
};

export default withRouter(UserInfo);
