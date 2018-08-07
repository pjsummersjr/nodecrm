import * as React from 'react';
import * as Adal from '../auth/adalRequest';

interface IDocumentsProps {}

interface IDocumentsState {
    documents: IDocument[];
    status?: string;
}

interface IDocument {
    title: string;
    description: string;
}

export default class Documents extends React.Component<IDocumentsProps, IDocumentsState> {

    public componentWillMount() {
        this.setState({
            documents:[],
            status: "Loading..."
        });
    }

    public componentDidMount() {
        let graphUrl = "http://localhost:3001/engagement/:engagementid/docs";
        let component = this;
        let componentRequest = Adal.adalRequest({
            url: graphUrl,
            headers : {
                "Accept" : "application/json; odata=verbose"
            }
        }).then(
            function(data){
                let jsonData = JSON.parse(data);
                console.log(jsonData);
                component.setState({
                    documents: jsonData.value
                })
            },
            function(err) {
                component.setState({
                    status: err
                });
            }
        ) // then
    } // componentDidMount

    public render() {
        console.log("Rendering DOcuments module");
        let docsModule = this.state.documents.map((item, index) => {
            return (<div>{item.title}</div>);
        })

        return  (<div>{docsModule}</div>);
    }

}