import express from 'express';
import path from 'path';

var app = express();

let staticPath:string = path.join(__dirname, 'web')
app.use(express.static(staticPath));
console.log(`Static files being loaded from here: ${staticPath}`)

app.get('/', (req, res) => {
    res.send('Hello from Typescript');
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});

