import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
    container: {
        padding: '2rem',
    },
    buttonContainer: {
        marginTop: '1rem',
    },
    btn: {
        minWidth: '100px',
    },
    header: {
        fontWeight: 'normal',
        marginBottom: '1rem',
        fontSize: theme.fontSizes.mainHeader,
    },
    configureContainer: { display: 'flex', width: '100%' },
    accordionContainer: {
        width: '68%',
    },
    executionContainer: {
        width: '32%',
    },
    envWarning: {
        marginBottom: '1rem',
    },
}));
