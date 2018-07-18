let corsOptions = {
    origin:'*',
    preflight: '*'
}

let expressConfig = {
    port: 3001
}

let appConfig = {
    resources: {        
        crm: "https://paulsumm.crm.dynamics.com",
        sp: "https://paulsumm.sharepoint.com",
        graph: "https://graph.microsoft.com"
    },
    servicePaths: {
        accounts: "/api/data/v9.0/accounts"
    }
}

export {corsOptions, expressConfig, appConfig}