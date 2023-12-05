import express from 'express'
import * as ml from './ml/main.js';
import * as data from './ml/data.js';
import 'dotenv/config'
import bodyParser from 'body-parser';
import _ from 'lodash';

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

app.get('/v1/getfoodbyid', async (req, res) => {
    const id =  null ?? req.query.id;
    if (!id) return res.status(400).send({success: false, message:'Missing parameter: id'});
    const food = {...data.getFoodbyId(id)[0]};
    if(_.isEmpty(food)) return res.status(404).send({success: false, message:'Food not found'});
    return res.status(200).send({success: true, data: food});
});

app.get('/v1/getallfood', async(req, res) => {
    return res.status(200).send({success: true, data: data.getAllFood()})
});


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
