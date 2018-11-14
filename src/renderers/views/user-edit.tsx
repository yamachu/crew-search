import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import { useState } from 'react';
import React = require('react');
import { withRouter } from 'react-router-dom';
import {
    ExtensionMessagePop2Back,
    FetchSearchUrlMessage,
    UpdateUserMessage,
} from '../../contracts/message';
import { AzureSearchService } from '../../services/AzureSearchClient';
import { AuthContext } from '../contexts/auth';
import UserEditWrapper, {
    FormInputWrappr,
    ProgressWrapper,
    RightAlignedDiv,
} from '../styles/user-edit';
import { GrowSpacer } from './spacer';

interface UserInfo {
    name: string;
    email: string;
    yomi: string;
    organization: string;
}

const UserEdit = (props: { [key: string]: any }) => {
    const auth = React.useContext(AuthContext);
    const [searchClient, setSearchClient] = useState<AzureSearchService | null>(null);
    const [info, setInfo] = useState<UserInfo>({
        name: auth.props.user!.displayName,
        email: auth.props.user!.email,
        yomi: '',
        organization: '',
    });
    const [isSending, setIsSending] = useState(false);

    const initalizeClient = () => {
        const message: ExtensionMessagePop2Back = {
            type: 'FETCH_SEARCH_URL',
        };
        chrome.runtime.sendMessage(message, (response: FetchSearchUrlMessage) => {
            if (!response.ok) {
                console.warn('Not Authrorized or ...', response);
            } else {
                const client = new AzureSearchService({
                    url: response.payload.url,
                    key: response.payload.token,
                });
                client.setIndex(response.payload.index);
                setSearchClient(client);
            }
        });
    };
    const saveInfo = (val: UserInfo): Promise<boolean> => {
        return new Promise<boolean>((resolve) => {
            const message: ExtensionMessagePop2Back = {
                type: 'UPDATE_USER',
                payload: {
                    user: val,
                },
            };
            chrome.runtime.sendMessage(message, (response: UpdateUserMessage) => {
                resolve(response.ok);
            });
        });
    };

    React.useEffect(() => {
        initalizeClient();
    }, []);
    React.useEffect(
        () => {
            if (searchClient === null) {
                return;
            }
            searchClient
                .searchUsers(auth.props.user!.email)
                .then((v: any[]) => {
                    const user = v.find((u) => u.email === auth.props.user!.email);
                    if (user === undefined) {
                        console.warn('User not found in AzureSearch');
                        return;
                    }
                    const { name, email, organization, yomi } = user;
                    setInfo(() => {
                        return {
                            name,
                            email,
                            organization,
                            yomi,
                        };
                    });
                })
                .catch((e) => {
                    console.warn('Fetch User failed', e);
                });
        },
        [searchClient]
    );

    const setFormValue = (target: keyof UserInfo) => (
        val: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setInfo((prev) => {
            return { ...prev, ...{ [target]: val.target.value } };
        });
    };

    return (
        <UserEditWrapper>
            <FormInputWrappr>
                <TextField
                    label="名前"
                    value={info.name}
                    onChange={setFormValue('name')}
                    margin="dense"
                />
                <TextField
                    label="メールアドレス"
                    value={info.email}
                    onChange={setFormValue('email')}
                    margin="dense"
                    disabled
                />
                {/* 所属部署リストみたいのがあるのであれば、AutoCompleteとか使ってみたい */}
                <TextField
                    label="所属"
                    value={info.organization}
                    onChange={setFormValue('organization')}
                    margin="dense"
                />
                <TextField
                    label="よみ"
                    value={info.yomi}
                    onChange={setFormValue('yomi')}
                    margin="dense"
                />
            </FormInputWrappr>
            <GrowSpacer />
            <RightAlignedDiv>
                <Button
                    variant="contained"
                    onClick={() => {
                        setIsSending(true);
                        saveInfo(info).then((success: boolean) => {
                            console.log(`User info save ${success ? 'success' : 'failed'}`);
                            setIsSending(false);
                        });
                    }}
                >
                    <SaveIcon />
                    保存
                </Button>
            </RightAlignedDiv>
            <Modal open={isSending} disableBackdropClick>
                <ProgressWrapper>
                    <CircularProgress />
                </ProgressWrapper>
            </Modal>
        </UserEditWrapper>
    );
};

export default withRouter(UserEdit);
