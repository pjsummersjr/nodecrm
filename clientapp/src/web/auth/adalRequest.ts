import q from 'q';
let AuthenticationContext = require('expose-loader?AuthenticationContext!../../../node_modules/adal-angular/lib/adal.js');
import adalConfig from './authConfig';

let _adal = new AuthenticationContext(adalConfig);
let _oauthData = { isAuthenticated: false, userName: '', loginError: '', profile: ''}

function processAdalCallback() {
    console.log("Processing ADAL callback");
    let parentWin  = (<any>window.parent); //For Typescript, I had to cast a separate object of type 'any' so we could use that object more dynamically
    let hash = window.location.hash;

    if(_adal.isCallback(hash)){

        if (parentWin && parentWin._adalInstance) {
            _adal = parentWin._adalInstance;
        }        
      
        if (_adal._openedWindows.length > 0) {    
            let lastWindow = _adal._openedWindows[_adal._openedWindows.length - 1];
        
            if (lastWindow.opener && lastWindow.opener._adalInstance) {        
                _adal = lastWindow.opener._adalInstance;        
            }  
        }

        let requestInfo = _adal.getRequestInfo(hash);
        _adal.saveTokenFromHash(requestInfo);
        window.location.hash = '';

        let callback = _adal._callBackMappedToRenewStates[requestInfo.stateResponse] || _adal.callback;
        
        if(requestInfo.stateMatch) {
            if(callback && typeof callback === 'function'){
                if(requestInfo.requestType === _adal.REQUEST_TYPE.RENEW_TOKEN){
                    if(requestInfo.parameters['access_token']){
                        callback(_adal._getItem(_adal.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters['access_token']);
                        return;
                    }
                    else if(requestInfo.parameters['id_token']){
                        callback(_adal._getItem(_adal.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters['id_token']);
                        return;
                    }
                }
            }
            else {
                updateDataFromCache(_adal.config.loginResource);
                if(_oauthData.userName){
                    window.setTimeout(function(){
                        updateDataFromCache(_adal.config.loginResource);
                        let loginStartPage = _adal._getItem(_adal.CONSTANTS.STORAGE.START_PAGE);
                        if(loginStartPage){
                            let winLocation = (<any>window.location);
                            winLocation.path = loginStartPage;
                        }
                    }, 1)
                }
            }
        }
    }

}

function isAuthenticated () {
    let deferred = q.defer();

    updateDataFromCache(_adal.config.loginResource);
    if(!_adal._renewActive && !_oauthData.isAuthenticated && !_oauthData.userName){
        if(!_adal._getItem(_adal.CONSTANTS.STORAGE.FAILED_RENEW)) {
            _adal.acquireToken(_adal.config.loginResource, function(error, tokenOut){
                if(error){
                    _adal.error('adal:failure', 'auto renew failure');
                    deferred.reject();
                }
                else {
                    if(tokenOut) {
                        _oauthData.isAuthenticated = true;
                        deferred.resolve();
                    }
                    else {
                        deferred.reject();
                    }
                }
            })
        }
        else {
            deferred.resolve();
        }
    }
    else {
        deferred.resolve()
    }

    return deferred.promise;
  
}

function adalRequest(settings): q.Promise<string> {
    let deferred = q.defer<string>();
    console.log(`Processing ADAL request for url ${settings.url}`)
    isAuthenticated().then(
        function() {
            let resource = _adal.getResourceForEndpoint(settings.url);
            if(!resource){
                _adal.info(`No resource configured for ${settings.url}`);
                deferred.reject(`No resource configured for ${settings.url}`);
                return deferred.promise;
            }

            let cachedToken = _adal.getCachedToken(resource);
            if(cachedToken){
                if(!settings.headers){
                    settings.headers = {};
                }
                settings.headers.Authorization = `Bearer ${cachedToken}`;
                makeRequest(settings).then(deferred.resolve, deferred.reject);
                
            }
            else {
                let isEndpoint = false;

                for(let endpointUrl in _adal.config.endpoints){
                    if(settings.url.indexOf(endpointUrl) > -1){
                        isEndpoint = true;
                    }
                }

                if(_adal.loginInProgress()){
                    _adal.info('Login already in progress');
                    deferred.reject('Login already in progress');
                }
                else if(isEndpoint){
                    _adal.acquireToken(resource, function(error, tokenOut){
                        if(error){
                            deferred.reject(error);
                            _adal.error(error);
                        }
                        else {
                            if(tokenOut){
                                _adal.verbose('Token is available');
                                if(!settings.headers){
                                    settings.headers = {};
                                }
                                settings.headers.Authorization = 'Bearer ' + tokenOut;
                                makeRequest(settings).then(deferred.resolve, deferred.reject);
                            }
                        }
                    });
                }
            }
        },
        function() {
            _adal.login();
            console.log(`Error from adalRequest reject function`);
            if(false) {
                return deferred.promise;
            }
        }
    );
    return deferred.promise;
}

function makeRequest(settings): q.Promise<string> {
    let deferred = q.defer<string>();

    let xhr = new XMLHttpRequest();

    xhr.onload = () => {
        if(xhr.status == 200){
            deferred.resolve(xhr.responseText)
        }
        else {
            deferred.reject(`Error retrieving data from ${settings.url}\n${xhr.status}: ${xhr.statusText}`);
        }
    }
    
    xhr.open("GET", settings.url,true);
    for(let header in settings.headers){
        xhr.setRequestHeader(header, settings.headers[header]);
    }    

    xhr.send();

    return deferred.promise;

}

function updateDataFromCache(resource) {
    let token = _adal.getCachedToken(resource);
    _oauthData.isAuthenticated = token !== null && token.length > 0;
    let user = _adal.getCachedUser() || {userName: ''};
    _oauthData.userName = user.userName;
    _oauthData.profile = user.profile;
    _oauthData.loginError = _adal.getLoginError();
}

export { processAdalCallback, adalRequest}

