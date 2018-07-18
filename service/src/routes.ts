import * as express from 'express';
import logger from 'morgan';
import request from 'request';

let router = express.Router();

router.use(function logTime(req, res, next) {
    console.log('Time: ', Date.now());
    next();
})

router.use(function checkForToken(req, res, next){
    if(!req.body.authorization){
        res.status(401);
        res.json({
            error: "No authorization token provided"
        })
    }
    console.log(req.body);
    next();
})

router.post('/', function(req, res){
    let crmUrl = "https://paulsumm.crm.dynamics.com/api/data/v9.0/accounts";
    //console.log(`Received authorization token from client\n${req.body.authorization}`);
    let options = {
        url: crmUrl,
        headers: {
            "Authorization": "Bearer " + req.body.authorization,
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
                res.status(200);
                res.json(body);  
            }
        }
    });
})

export default router;