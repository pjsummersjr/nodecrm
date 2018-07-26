import * as React from 'react';
import * as Adal from '../auth/adalRequest';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';

import Engagement from '../Entities/Engagements';

interface IEngagementsProps {}
interface IEngagementsState {
    engagements: Engagement[];
    status: string;
}

export default class Engagements extends React.Component<IEngagementsProps, IEngagementsState> {

    public componentWillMount() {
        this.setState({
            engagements: [],
            status: "Loading"
        });
    }

    public componentDidMount() {
        let component = this;
        let serverRequest = Adal.adalRequest({
            url: 'http://localhost:3001/engagements',
            headers: {
                "Accept": "application/json;odata.metadata=minimal;",
                "Cache-control": "no-store"
            }
        }).then(function(data){
            let records = JSON.parse(data);
            
            component.setState({
                engagements: records,
                status: "Engagements loaded as expected"
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

    public render() {
        if(this.state && this.state.engagements){
            let engList = this.state.engagements.map((item, index) => {
                return(
                    <ExpansionPanel key={item.engagementid}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{item.name}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                {item.goal}
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>                    
                    );
            });
            return(
                    <Grid container spacing={24}>
                        <Grid item xs={6}>
                            {engList}
                        </Grid>
                        <Grid item xs={6}>
                            <div>No engagement detail content available</div>
                        </Grid>
                    </Grid>
                )
        }
        else {
            return (<div>Nothing found :-(</div>);
        }
    }
}