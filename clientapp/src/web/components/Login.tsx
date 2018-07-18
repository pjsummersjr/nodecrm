import * as React from 'react';
import Button from '@material-ui/core/button';
import Typography from '@material-ui/core/Typography';

import authConfig from '../auth/authConfig';
import { AdalConfig, Authentication } from 'adal-typescript';

interface ILoginModuleProps {}
interface ILoginModuleState {
    isLoggedIn: boolean,
    userName?: string,
    emailAddress?: string,
    userImage?: string
}

export default class LoginModule extends React.Component<ILoginModuleProps, ILoginModuleState> {

    public componentWillMount() {
        Authentication.getAadRedirectProcessor().process();
        let config = new AdalConfig(authConfig.clientId,authConfig.tenant,authConfig.redirectUri,"",authConfig.responseType,authConfig.extraQueryParameter);
        let context = Authentication.getContext(config);
        let user = context.getUser();
        if(user) {            
            this.setState({
                isLoggedIn: true,
                emailAddress: user.family_name,
                userName: user.name
            })
        }
        else {
            this.setState({
                isLoggedIn: false
            })
        }
    }

    public login = () => {
        console.debug("Logging in to Azure Active Directory");
        let config = new AdalConfig(authConfig.clientId,authConfig.tenant,authConfig.redirectUri,"",authConfig.responseType,authConfig.extraQueryParameter);
        let context  = Authentication.getContext(config);
        context.login();
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