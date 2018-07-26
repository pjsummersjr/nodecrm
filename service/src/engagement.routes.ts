import * as express from 'express';
import logger from 'morgan';
import request, { UriOptions } from 'request';
import cors from 'cors';

import * as serviceConfig from './serviceConfig';
import Engagement from './entities/engagement';

let router = express.Router();

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


router.get('/:engagementid', cors(serviceConfig.corsOptions),
    function(req, res){
        console.log(`Account id is: ${req.params.accountid}`)
        let crmUrl = `https://mtcprod.crm.dynamics.com/api/data/v8.2/api/msdyn_workorders?$filter=msdyn_workorderid eq ${req.params.engagementid}&$expand`;
        let options = {
            url: crmUrl,
            headers: {
                "Authorization": req.get('Authorization'),
                "Accept": "application/json; odata.metadata=minimal;"
            }
        }
        getContent(options, req, res);
    }
);

/**
 * Returns all engagements
 */
router.get('/', cors(serviceConfig.corsOptions) , function(req, res){
    console.log('Default engagements route');
    //Want my select properties to reflect the required fields - might want to parameterize (OData-ify) this method as well
    let crmUrl = "https://mtcprod.crm.dynamics.com/api/data/v8.2/msdyn_workorders?$top=50&$select=msdyn_name,mtc_title,mtc_goal,mtc_siebelaccountname,mtc_engagementlead,mtc_engagementnumber,msdyn_workorderid";
    let options = {
        url: crmUrl,
        headers: {
            "Authorization": req.get('Authorization'),
            "Accept": "application/json; odata.metadata=minimal;"
        }
    }
    getContent(options, req, res);
});
/**
 * Encapsulates code for making calls to my ThreeCloud endpoints. For GET requests only.
 * @param urlPath 
 * @param req 
 * @param res 
 */
function getContent(options: any, req: any, res: any) {
    console.log(`Requesting resources from: ${options.url}`)
    console.log(`Access token: ${req.get('Authorization')}`);

    request.get(options, (error: any, response: any, body: any) => {
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
                let engagements = mapToEntity(JSON.parse(body));
                res.status(200);
                res.json(engagements);
            }
        }
    });
}

function mapToEntity(data:any){
    let engagements: Engagement[] = [];
    //console.log(data);
    data.value.map((item: any, index: any) => {
        let eng:Engagement = {
            name: item.msdyn_name,
            customername: item.mtc_siebelaccountname,
            leadarchitect: item.mtc_engagementlead,
            startdate: new Date(),
            enddate: new Date(),
            goal: item.mtc_goal,
            engagementid: item.msdyn_workorderid,
            engagementnum: item.mtc_engagementnumbe
        }
        engagements.push(eng);        
    });
    return engagements;
}

export default router;