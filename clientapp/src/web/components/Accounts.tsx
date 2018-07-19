import * as React from 'react';
import AuthConfig from '../auth/authConfig';
import {AdalConfig, Authentication} from 'adal-typescript';
import authConfig from '../auth/authConfig';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LanguageIcon from '@material-ui/icons/Language';
import Grid from '@material-ui/core/Grid';

interface IAccountsProps {}
interface IAccountsState {
    status?: string,
    accountRecords?:IAccountEntity[]
}
interface IAccountEntity {
    accountnumber: string,
    name: string,
    websiteurl: string
}
export default class Accounts extends React.Component<IAccountsProps, IAccountsState> {

    public componentWillMount(){
        this.setState({
            status: "Loading...",
            accountRecords: []
        });
    }

    public componentDidMount() {
        Authentication.getAadRedirectProcessor().process();
        let config = new AdalConfig(authConfig.clientId,authConfig.tenant,authConfig.redirectUri,"",authConfig.responseType,authConfig.extraQueryParameter);
        let context = Authentication.getContext(config);
        
        if(context.getUser()) {
            console.debug("User logged in. Retrieving account records.");
            let theToken = context.getAccessToken();
            console.debug("Auth token: " + theToken); //need to remove this at some point
            let req = new XMLHttpRequest();
            
            let url = "http://localhost:3001/accounts";
            req.open("GET", url, true);
            req.setRequestHeader("Authorization", "Bearer " + theToken);
            req.setRequestHeader("Accept", "application/json;odata.metadata=minimal;");
            req.setRequestHeader("Cache-control", "no-store");
                        
            req.onload = () => {
                console.log("In the onload method");
                if(req.status == 200 || req.status == 304){
                    let records = JSON.parse(req.responseText);
                    console.debug("Retrieved JSON. Updating state with account records.");
                    this.setState({
                        accountRecords: records.value,
                        status: `Account records retrieved successfully`
                    })
                }
                else {
                    console.error(`Error retrieving account records.\n${req.status}\n${req.statusText}`)
                    this.setState({
                        status: 'Records could not be found'
                    })
                }
            }
            
            req.send();
        }
        else {
            console.error("No user logged in.");
            this.setState({
                status: 'Please login to view account records'
            })
        }
    }

    public openWebsite = (websiteurl: string, e: any) => {
        alert(`Website is: ${websiteurl}`);
    }

    public render() {
        if(this.state && this.state.accountRecords && this.state.accountRecords && this.state.accountRecords.length > 0){
            console.debug("State is not null. Rendering account records.");
            return (this.state.accountRecords.map((item, index) => {
                return (
                        <Grid item xs={3} key={item.accountnumber}>
                            <Card>
                                <CardContent>
                                    <Typography>{item.name}</Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton color="primary" onClick={(e) => this.openWebsite(item.websiteurl, e)}>
                                        <LanguageIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                        )
            }));
        }
        else {
            console.debug("No account records in state object.");
            return (<div>{this.state.status}</div>);
        }
    }
}