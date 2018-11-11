import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

export default styled.div`
    width: 100%;
`;

export const FlexDiv = styled.div`
    display: flex;
`;

export const GrowingCenteringTypography = styled(Typography)`
    flex-grow: 1;
    align-self: center;
    text-align: center;
`;

export const WrappedTypography = styled(Typography)`
    overflow-wrap: break-word;
`;
