import * as React from 'react';
import * as Adal from '../auth/adalRequest';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LanguageIcon from '@material-ui/icons/Language';
import GroupIcon from '@material-ui/icons/Group';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

import ContactsDialog from './AccountContactsDialog';

interface IAccountsProps {}
interface IAccountsState {
    status?: string,
    accountRecords?:IAccountEntity[],
    contactsDialog: Map<string, boolean>
}
interface IAccountEntity {
    accountid: string,
    name: string,
    websiteurl: string
}

interface Hashtable<T> {
    [key: string]: T;
}
export default class Accounts extends React.Component<IAccountsProps, IAccountsState> {

    public componentWillMount(){
        let tmp: Map<string, boolean> = new Map<string, boolean>();
        this.setState({
            status: "Loading...",
            accountRecords: [],
            contactsDialog: tmp
        });
    }

    public componentDidMount() {
        let component = this;
        let serverRequest = Adal.adalRequest({
            url: 'http://localhost:3001/accounts',
            headers: {
                "Accept": "application/json;odata.metadata=minimal;",
                "Cache-control": "no-store"
            }
        }).then(function(data){
            let records = JSON.parse(data);
            component.setState({
                accountRecords: records.value,
                status: "Retrieved account records"
            })
        },
            function(err) {
                console.error(`Error retrieving account records\n${err}`);
                component.setState({
                    status:`There was an error retrieving the account records`
                })
            }
        );
    }

    public openWebsite = (websiteurl: string, e: any) => {
        alert(`Website is: ${websiteurl}`);
    }

    public openContacts = (accountid: string, e: any) => {
        let tmp = this.state.contactsDialog;
        tmp.set(accountid, true);
        this.setState({
           contactsDialog: tmp 
        });
    }

    public closeDialog = (accountid: string, openState: boolean) => {
        let tmp = this.state.contactsDialog;
        tmp.set(accountid, openState);
        this.setState({
            contactsDialog: tmp
        });
    } 

    public render() {
        if(this.state && this.state.accountRecords && this.state.accountRecords && this.state.accountRecords.length > 0){
            console.debug("State is not null. Rendering account records.");
            let accounts = this.state.accountRecords.map((item, index) => {
                let dialogState: boolean = this.state.contactsDialog.get(item.accountid) ? this.state.contactsDialog.get(item.accountid) : false;
                return (
                        <Grid item xs={3} key={item.accountid}>
                            <Card>
                                <CardContent>
                                    <Typography>{item.name}</Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton color="primary" onClick={(e) => this.openWebsite(item.websiteurl, e)}>
                                        <LanguageIcon />
                                    </IconButton>
                                    <IconButton color="primary" onClick={(e) => this.openContacts(item.accountid, e)}>
                                        <GroupIcon />
                                    </IconButton>
                                </CardActions>
                                <ContactsDialog onClose={this.closeDialog} acccountid={item.accountid} accountname={item.name} open={dialogState} />
                            </Card>
                        </Grid>                        
                        )
            })
            return (
                <Grid container spacing={24}>
                    {accounts}
                </Grid>
            );
        }
        else {
            console.debug("No account records in state object.");
            return (<div><LinearProgress /></div>);
        }
    }
}