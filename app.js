import express from 'express'
import * as ml from './ml/main.js';
import 'dotenv/config'
import bodyParser from 'body-parser';

const PORT = parseInt(process.env.PORT) || 8080;
const app = express()
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(["Hello", "World!"]);
});

app.get('/v0/test', async (req, res) => {
    // const par = req.query;
    const foodsId = await ml.recommendation(1800, ['daging_ayam', 'sayur']);
    res.send(foodsId);
});

app.post('/v0/testjson', async (req, res) => {
    const json = req.body;
    const test = {status:"test",json:json};
    res.send(test);
});


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
