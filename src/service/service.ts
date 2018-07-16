import express from 'express';

let port = 3001;

var app = express();

app.get('/', (req, res) => {
    res.json({message:'No services on this endpoint'});
});

app.listen(port, () => {
    console.log(`The app service is running on port ${port}`);
});

