import * as React from 'react';
import * as Adal from '../auth/adalRequest';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Button from '@material-ui/core/Button';

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

    public loadStatus = () => {

    }

    public loadDocuments = (engagementid, customername, e) => {
        alert(`Loading data for engagement ${customername}`);
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
                            <div className="expansion-summary-75">
                                <Typography variant="subheading">{item.name}</Typography>
                            </div>
                            <div className="expansion-summary-25">
                                <Typography variant="body2">{item.customername}</Typography>
                            </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                {item.goal}
                            </Typography>
                        </ExpansionPanelDetails>                        
                        <ExpansionPanelActions>
                            <Button size="small" onClick={(e) => this.loadDocuments(item.engagementid, item.customername, e)}>Show Documents</Button>
                            <Button size="small" color="primary">Show Status Details</Button>
                        </ExpansionPanelActions>
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
            return (<div><LinearProgress /></div>);
        }
    }
}