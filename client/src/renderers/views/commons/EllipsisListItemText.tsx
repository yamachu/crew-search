import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';

export default withStyles({
    primary: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    secondary: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
})(ListItemText);
