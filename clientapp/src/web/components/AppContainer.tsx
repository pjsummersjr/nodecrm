import * as React from 'react';
import LoginModule from './Login';
import Accounts from './Accounts';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import { Icon } from '@material-ui/core';



interface IAppContainerProps {}

interface IAppContainerState {}

export default class AppContainer extends React.Component<IAppContainerProps, IAppContainerState> {
    
    
    public render() {
        return (
            <div>
                <AppBar position="static" className="appBar">
                    <Grid container spacing={24}>
                        <Grid item xs={1}>
                            <IconButton color="inherit" aria-label="Menu">
                                <MenuIcon/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={8} className="appTitle">
                            <Typography variant="title" color="inherit">Three Clouds, Three Ways</Typography>
                        </Grid>
                        <Grid item xs>
                            <LoginModule></LoginModule>
                        </Grid>
                    </Grid>
                </AppBar>
                <Grid container spacing={24}>
                    <Accounts />
                </Grid>
            </div>
        );
    }
}