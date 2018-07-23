import * as React from 'react';
import * as Adal from '../auth/adalRequest';
import Button from '@material-ui/core/button';
import Typography from '@material-ui/core/Typography';

/* import authConfig from '../auth/authConfig';
import { AdalConfig, Authentication } from 'adal-typescript'; */

interface ILoginModuleProps {}
interface ILoginModuleState {
    isLoggedIn: boolean,
    userName?: string,
    emailAddress?: string,
    userImage?: string
}

export default class LoginModule extends React.Component<ILoginModuleProps, ILoginModuleState> {

    public componentWillMount() {
        this.setState({
            isLoggedIn: false
        })
    }

    public login = () => {

        console.log(`Attempting login`);
        let component = this;
        Adal.adalRequest({
            url: 'http://localhost:3001/accounts',
            headers: {
                "Accept": "application/json;odata.metadata=minimal;",
                "Cache-control": "no-store"
            }
        }).then(function(data){
            console.log(`The data from the new adal implementation: ${data}`);
        }, function(err) {
            console.log(`Error retrieving data ${err}`);
        });
    }

    public render() {
        if(!this.state.isLoggedIn) {
            return (<Button variant="contained" color="primary" onClick={this.login}>Login</Button>);
        }
        else {
            return (
                <div>
                    <Typography variant="body2" color="inherit">{this.state.userName}</Typography>
                    <Typography variant="body1" color="inherit">{this.state.emailAddress}</Typography>
                </div>
            );
        }
        
    }
}