import * as express from 'express';
import logger from 'morgan';
import request from 'request';
import cors from 'cors';

import * as serviceConfig from './serviceConfig';

let router = express.Router();

let corsOptions = {
    origin: '*'
}

router.use(function logTime(req, res, next) {
    console.log('Time: ', Date.now());
    next();
})

router.use(function checkForToken(req, res, next){
    if(!req.get("Authorization")) {
        console.error("Did not get an authorization token in the header.");
        res.status(401);
        res.json({
            error: "No authorization token provided"
        })        
    }
    else {
        next();
    }
    
})
/**
 * Searches for accounts by name
 */
/* router.get('/:name', cors(serviceConfig.corsOptions), function(req, res){
    let crmUrl = "https://paulsumm.crm.dynamics.com/api/data/v9.0/accounts?$filter=name eq '" + req.params.name + "'";
    getContent(crmUrl, req, res);
}); */
/**
 * Retrieves documents trending around the current user
 */
router.get('/docs', cors(serviceConfig.corsOptions), function(req, res) {
    let url = "https://paulsumm.sharepoint.com/_api/search/query?QueryText='*'";
    getContent(url, req, res);
});

/**
 * Returns all accounts
 */
router.get('/', cors(serviceConfig.corsOptions) , function(req, res){
    //Want my select properties to reflect the required fields - might want to parameterize (OData-ify) this method as well
    let crmUrl = "https://paulsumm.crm.dynamics.com/api/data/v9.0/accounts?$select=name,websiteurl,accountnumber";
    getContent(crmUrl, req, res);
});
/**
 * Encapsulates code for making calls to my ThreeCloud endpoints. For GET requests only.
 * @param urlPath 
 * @param req 
 * @param res 
 */
function getContent(urlPath: string, req: any, res: any) {
    console.log(`Requesting resources from: ${urlPath}`)
    let options = {
        url: urlPath,
        headers: {
            "Authorization": req.get('Authorization'),
            "Accept": "application/json;odata.metadata=minimal;"
        }
    }

    request.get(options, (error, response, body) => {
        if(error) {
            console.error(`An error occurred:\n${error}`);
        }
        else {
            if(response.statusCode != 200) {
                res.status(response.statusCode);
                res.json({
                    error: response.statusMessage
                })
            }
            else {
                let bodyAsJson = JSON.parse(body);
                res.status(200);
                res.json(bodyAsJson);
            }
        }
    });
}

export default router;