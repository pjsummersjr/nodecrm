import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import router from './routes';
import cors from 'cors';
import logger from 'morgan';

let port = 3001;

var app = express();

app.options('*', cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/accounts', router);

app.get('/', (req, res) => {
    res.json({message:'No services on this endpoint'});
});

app.listen(port, () => {
    console.log(`The app service is running on port ${port}`);
});

