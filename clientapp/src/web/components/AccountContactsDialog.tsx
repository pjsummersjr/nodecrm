import * as React from 'react';
import * as Adal from '../auth/adalRequest';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Contact from '../Entities/Contact';

interface IContactsDialogState {
    accountid: string;
    accountname: string;
    open: boolean;
    contacts: Contact[];
}
interface IContactsDialogProps {
    acccountid:string;
    accountname?: string;
    open:boolean;
    onClose: any;
}

export default class ContactsDialog extends React.Component<IContactsDialogProps, IContactsDialogState> {

    public componentWillMount(){
        this.setState({
            accountid:"",
            open:this.props.open
        })
    }

    public componentDidUpdate(prevProps, prevState, snapShot){
        if(prevProps !== this.props && this.props.open){
            this.loadContacts();
        }
    }

    public loadContacts() {
        
        let component = this;
        let serverRequest = Adal.adalRequest({
            url: `http://localhost:3001/accounts/${this.state.accountid}/contacts`,
            headers: {
                "Accept": "application/json;odata.metadata=minimal;",
                "Cache-control": "no-store"
            }
        }).then(
            function(data){
                console.log('Got contact records');
                let records = JSON.parse(data);
                console.log(records);
                component.setState({
                    contacts: records.value
                })
            },
            function(err) {
                console.error(`Error retrieving contact records\n${err}`);
            }
        );
    }

    //public componentWillReceiveProps - need to implement this or something so that I can handle changes 
    //to the IContactsDialogProps.open attribute for opening/closing this dialog

    public componentDidMount() {
        this.setState({
            accountid: this.props.acccountid,
            accountname: this.props.accountname,
            open: this.props.open
        });
        if(this.props.open){
            this.loadContacts();
        }
    }

    public handleClose = () =>{
        console.log('Handling the close option');
        this.props.onClose(this.state.accountid, false);
    }

    public render() {
        let contactsEl = null;
        if(this.state && this.state.contacts){
            console.log('Mapping contacts');
            contactsEl = this.state.contacts.map((item, index) => {
                return (<ExpansionPanel key={item.contactid}>
                    <ExpansionPanelSummary>
                        <Typography>{item.fullname}</Typography>
                        <Typography>{item.jobtitle}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>{item.emailaddress1}</Typography>
                        <Typography>{item.phonenumber1}</Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>);
            });
        }
        return (<Dialog onClose={this.handleClose} open={this.props.open}>
                    <DialogTitle>{this.state.accountname}</DialogTitle>
                    {contactsEl}
                </Dialog>);
    }

}