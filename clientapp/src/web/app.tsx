import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppContainer from './components/AppContainer';
import * as Adal from './auth/adalRequest'

export default class ThreeCloudApp {
    public run(): void {
        alert("It's working");
    }
}
Adal.processAdalCallback();
ReactDOM.render(<AppContainer />, document.getElementById('app'));