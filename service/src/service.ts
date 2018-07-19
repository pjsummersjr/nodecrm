import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import accountRouter from './account.routes';
import cors from 'cors';
import logger from 'morgan';
import * as serviceConfig from './serviceConfig';

let port = serviceConfig.expressConfig.port;

console.log("Service config: " + serviceConfig);

var app = express();

app.options(serviceConfig.corsOptions.preflight, cors(serviceConfig.corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/accounts', accountRouter);

app.get('/', (req, res) => {
    res.status(404);
    res.json({message:'No services on this endpoint'});
});

app.listen(port, () => {
    console.log(`The app service is running on port ${port}`);
});

