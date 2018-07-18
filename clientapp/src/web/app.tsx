import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppContainer from './components/AppContainer';

export default class ThreeCloudApp {
    public run(): void {
        alert("It's working");
    }
}

ReactDOM.render(<AppContainer />, document.getElementById('app'));