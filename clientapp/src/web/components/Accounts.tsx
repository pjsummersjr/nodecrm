import * as React from 'react';
import * as Adal from '../auth/adalRequest';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LanguageIcon from '@material-ui/icons/Language';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

interface IAccountsProps {}
interface IAccountsState {
    status?: string,
    accountRecords?:IAccountEntity[]
}
interface IAccountEntity {
    accountid: string,
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

    public render() {
        if(this.state && this.state.accountRecords && this.state.accountRecords && this.state.accountRecords.length > 0){
            console.debug("State is not null. Rendering account records.");
            return (this.state.accountRecords.map((item, index) => {
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
                                </CardActions>
                            </Card>
                        </Grid>
                        )
            }));
        }
        else {
            console.debug("No account records in state object.");
            return (<div><LinearProgress /></div>);
        }
    }
}