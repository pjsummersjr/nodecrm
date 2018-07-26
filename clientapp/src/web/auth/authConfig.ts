

let authConfig = {
    tenant: 'common',
    clientId: 'd342c33d-b17a-498a-9314-02a5adc177c3',
    redirectUri: 'http://localhost:3000',
    disableRenewal: true,
    extraQueryParameter: 'nux=1',
    endpoints: {
        'http://localhost:3001/accounts/docs': 'https://paulsumm.sharepoint.com',
        'http://localhost:3001/accounts': 'https://mtcprod.crm.dynamics.com',
        'http://localhost:3001/engagements': 'https://mtcprod.crm.dynamics.com',
        'http://localhost:3001/insights': 'https://graph.microsoft.com'
    },
    responseType:'token',
    cacheLocation: 'localStorage'
}

export default authConfig;