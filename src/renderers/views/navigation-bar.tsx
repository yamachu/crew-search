import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useContext, useState } from 'react';
import React = require('react');
import { AuthContext } from '../contexts/auth';
import { GrowSpacer } from './spacer';
import NavigationWrapper from './styles/navigation-bar';

export const NavigationBar = () => {
    const auth = useContext(AuthContext);
    const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

    return (
        <NavigationWrapper>
            <AppBar position={'static'}>
                <Toolbar variant={'dense'}>
                    <GrowSpacer />
                    {auth.props.isSignedIn ? (
                        <IconButton
                            aria-owns={Boolean(anchorElement) ? 'material-appbar' : undefined}
                            aria-haspopup={'true'}
                            color={'inherit'}
                            onClick={(ev) =>
                                /* setAnchorElement(ev.currentTarget) */ console.info(
                                    'Icon Clicked'
                                )
                            }
                        >
                            <AccountCircle />
                        </IconButton>
                    ) : (
                        <Button
                            onClick={(_) => {
                                auth.actions.signIn();
                            }}
                            color={'inherit'}
                            size={'small'}
                        >
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            <AccountMenu
                {...{
                    state: {
                        anchorElement,
                    },
                    actions: {
                        onClose: () => {
                            setAnchorElement(null);
                        },
                    },
                }}
            />
        </NavigationWrapper>
    );
};

interface AccountMenuProps {
    state: {
        anchorElement: HTMLElement | null;
    };
    actions: {
        onClose: () => void;
    };
}

const AccountMenu = (props: AccountMenuProps) => {
    return (
        <Menu
            anchorEl={props.state.anchorElement}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(props.state.anchorElement)}
            onClose={props.actions.onClose}
        >
            <MenuItem
                dense={true}
                onClick={() => {
                    console.debug('Will be implemented...');
                }}
            >
                {'Dummy'}
            </MenuItem>
        </Menu>
    );
};
