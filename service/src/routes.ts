import * as express from 'express';
import logger from 'morgan';
import request from 'request';
import cors from 'cors';

let router = express.Router();

let corsOptions = {
    origin: 'http://localhost:3000'
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

router.get('/', cors(corsOptions) , function(req, res){
    let crmUrl = "https://paulsumm.crm.dynamics.com/api/data/v9.0/accounts";

    let options = {
        url: crmUrl,
        headers: {
            "Authorization": req.get("Authorization"),
            "Accept": "application/json;odata.metadata=minimal;"
        }
    }
    request.get(options, (error, response, body)=> {
        if(error) {
            console.error(`Error: ${error}`);
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
                //res.set('Access-Control-Allow-Origin', '*'); //This response header is required to provide CORS support
                res.status(200);
                res.json(bodyAsJson);  
            }
        }
    });
})

export default router;