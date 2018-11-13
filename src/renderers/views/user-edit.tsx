import React = require('react');
import { withRouter } from 'react-router-dom';
import UserEditWrapper from '../styles/user-edit';

const UserEdit = (props: {
    location: {
        state: {
            user: any;
        };
    };
    [key: string]: any;
}) => {
    return <UserEditWrapper>編集フォームだよ</UserEditWrapper>;
};

export default withRouter(UserEdit);
