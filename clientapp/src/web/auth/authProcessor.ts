import q from 'q';
import AuthConfig from './authConfig';
let AuthenticationContext = require('expose?AuthenticationContext!../../node_modules/modular-adal-angular/lib/adal.js');
let auth = new AuthenticationContext(AuthConfig);
let _oauthData = { isAuthenticated: false, userName: '', loginError: '', profile: '' };

export default class AuthProcessor {
    public processCallback() {
        var hash = window.location.hash;

  if (auth.isCallback(hash)) {
/*     if (window.parent && window.parent._adalInstance) {
        auth = window.parent._adalInstance;
    } */

    if (auth._openedWindows.length > 0) {
      var lastWindow = auth._openedWindows[auth._openedWindows.length - 1];
      if (lastWindow.opener &&
        lastWindow.opener._adalInstance) {
            auth = lastWindow.opener._adalInstance;
      }
    }

    // callback can come from login or iframe request
    auth.verbose('Processing the hash: ' + hash);
    var requestInfo = auth.getRequestInfo(hash);
    auth.saveTokenFromHash(requestInfo);
    window.location.hash = '';
    // Return to callback if it is sent from iframe
    var callback = auth._callBackMappedToRenewStates[requestInfo.stateResponse] || auth.callback;

    if (requestInfo.stateMatch) {
      if (callback && typeof callback === 'function') {
        // Call within the same context without full page redirect keeps the callback
        if (requestInfo.requestType === auth.REQUEST_TYPE.RENEW_TOKEN) {
          // Idtoken or Accestoken can be renewed
          if (requestInfo.parameters['access_token']) {
            callback(auth._getItem(auth.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters['access_token']);
            return;
          }
          else {
            if (requestInfo.parameters['id_token']) {
              callback(auth._getItem(auth.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters['id_token']);
              return;
            }
          }
        }
      }
      else {
        // normal full login redirect happened on the page
        this.updateDataFromCache(auth.config.loginResource);
        if (_oauthData.userName) {
          //IDtoken is added as token for the app
          window.setTimeout(function () {
            this.updateDataFromCache(auth.config.loginResource);
            // redirect to login requested page
            var loginStartPage = auth._getItem(auth.CONSTANTS.STORAGE.START_PAGE);
            if (loginStartPage) {
              window.location.href = loginStartPage;
            }
          }, 1);
        }
      }
    }
}
    }

    private updateDataFromCache(resource) {
        // only cache lookup here to not interrupt with events
        var token = auth.getCachedToken(resource);
        _oauthData.isAuthenticated = token !== null && token.length > 0;
        var user = auth.getCachedUser() || { userName: '' };
        _oauthData.userName = user.userName;
        _oauthData.profile = user.profile;
        _oauthData.loginError = auth.getLoginError();
    }


    public isAuthenticated(): Promise<string> {
        let deferred = q.defer();

        this.updateDataFromCache(auth.config.loginResource);
        if (!auth._renewActive && !_oauthData.isAuthenticated && !_oauthData.userName) {
            if (!auth._getItem(auth.CONSTANTS.STORAGE.FAILED_RENEW)) {
              // Idtoken is expired or not present
              auth.acquireToken(auth.config.loginResource, function(error, tokenOut) {
                if (error) {
                    auth.error('adal:loginFailure', 'auto renew failure');
                  deferred.reject();
                }
                else {
                  if (tokenOut) {
                    _oauthData.isAuthenticated = true;
                    deferred.resolve();
                  }
                  else {
                    deferred.reject();
                  }
                }
              });
            }
            else {
              deferred.resolve();
            }
          }
          else {
            deferred.resolve();
          }

        return deferred.promise;
    }

    public authRequest(settings: any): Promise<string> {
        let deferred = q.defer();
        this.isAuthenticated().then(
            (response) => {
                let resource = auth.getResourceForEndpoint(settings.url);

                if(!resource) {
                    auth.info(`No resource configured for ${settings.url}`);
                    deferred.reject(`No resource configured for ${settings.url}`);
                    return deferred.promise;
                }

                let tokenStored: string = auth.getCachedToken(resource);
                if(tokenStored) {
                    if(!settings.headers) {
                        settings.headers = {}
                    }
                    settings.headers.Authorization = 'Bearer ' + tokenStored;
                    this.makeRequest(settings).then(deferred.resolve, deferred.reject);
                }
                else {
                    let isEndpoint: boolean = false;
                    for(var endPointUrl in auth.config.endpoints) {
                        if(settings.url.indexOf(endPointUrl) > -1) {
                            isEndpoint = true;
                        }
                    }
                    if(auth.loginInProgress()){
                        auth.info('Login already in progress');
                        deferred.reject();
                    }
                    else if(isEndpoint) {
                        auth.acquireToken(resource, (error, tokenOut) => {
                            if(error){
                                auth.error(error);
                                deferred.reject();
                            }
                            else {
                                if(tokenOut) {
                                    auth.verbose('Got the token');
                                    if(!settings.headers) {
                                        settings.headers = {}
                                    }
                                    settings.headers.Authorization = 'Bearer ' + tokenOut;
                                    this.makeRequest(settings).then(deferred.resolve, deferred.reject);
                                }
                            }
                        })
                    }
                }
            },
            () => {
                auth.login();
            } 
        )
        return deferred.promise;
    } 

    public makeRequest(settings: any): Promise<string> {
        let deferred = q.defer();

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(this.readyState) {
                if(this.status == 200) {
                    deferred.resolve(this.response);
                }
                else if(this.status >= 400){
                    deferred.reject();
                }
            }
        }
        xhr.open(settings.method || "GET", settings.url, true);

        for(var header in settings.header) {
            xhr.setRequestHeader(header, settings.headers[header]);
        }

        xhr.responseType = settings.dataType || "json";
        xhr.send(settings.data);

        return deferred.promise;
    }
}