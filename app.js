import express from 'express'
import * as ml from './ml/main.js';
import * as data from './ml/data.js';
import 'dotenv/config'
import bodyParser from 'body-parser';
import _ from 'lodash';
import * as db_user from './firestore/user.js';


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

app.get('/v1/getallergenbyid', async(req, res) => {
    const id =  null ?? req.query.id;
    if (!id) return res.status(400).send({success: false, message:'Missing parameter: id'});
    const allergen = {...data.getAllergenbyId(id)[0]};
    if(_.isEmpty(allergen)) return res.status(404).send({success: false, message:'Allergen not found'});
    return res.status(200).send({success: true, data: allergen});
});

app.post('/v1/recommend', async (req, res) => {
    const calories = null ?? req.body.calories;
    let allergies = null ?? req.body.allergies;
    
    
    if (!calories && !allergies) return res.status(400).send({success: false, message:'Missing parameter: calories, allergies[]'});
    if (!calories) return res.status(400).send({success: false, message:'Missing parameter: calories'});
    if (!allergies) return res.status(400).send({success: false, message:'Missing parameter: allergies'});

    allergies = allergies.map((val) => _.isInteger(val) ? data.getAllergenbyId(val)[0]?.allergen_name : val);
    const invalidAllergies = allergies.findIndex((val) =>  _.isNull(val) || _.isUndefined(val));
    if(invalidAllergies >= 0) return res.status(400).send({success: false, message:`Invalid Allergen: one or more allergen by id is not valid`});

    const food_recommendation = await ml.recommendation(calories, allergies);
     console.log(food_recommendation);
    return res.status(200).send({success: true, data: food_recommendation.slice(0,4).map((val) =>({...data.getFoodbyId(val)[0]}))});
});

app.get('/v1/getallallergen', async(req, res) => {
    return res.status(200).send({success: true, data: data.getAllAllergen()})
});

// use of db
app.post('/v1/adduser', async (req,res) => {
    const email = null ?? req.body.email;
    const name = req.body.name ?? "Unnamed";
    if(!email) return res.status(400).send({success: false, message:`Missing parameter: email`});

    const user = await db_user.create_user(email, name);
    
    if(user.status=="error") {
        return res.status(400).send({success: false, message: user.message});
    } else {
        return res.status(200).send({success: true, message: user.message});
    }   
});

app.get('/v1/getuser', async (req, res) => {
    const email = null ?? req.query.email;
    if(!email) return res.status(400).send({success: false, message:`Missing parameter: email`});

    const user = await db_user.get_user(email);
    
    if(user.status=="error") {
        return res.status(400).send({success: false, message: user.message});
    } else {
        return res.status(200).send({success: true, message: user.message, data: user.data});
    }  
}); 

app.get('/v1/getuserinfo', async (req,res) => {
    const email = null ?? req.body.email;
    if(!email) return res.status(400).send({success: false, message:`Missing parameter: email`});

    const user = await db_user.get_userinfo(email);
    
    if(user.status=="error") {
        return res.status(400).send({success: false, message: user.message});
    } else {
        return res.status(200).send({success: true, message: user.message});
    }   
});

app.post('/v1/updateuserinfo', async (req,res) => {
    const message = [];
    const {email, height, weight, age, gender} = req.body;
    if(!email) message.push(`Missing parameter: email`);
    if(!height) message.push(`Missing parameter: height`);
    if(!weight) message.push(`Missing parameter: weight`);
    if(!age) message.push(`Missing parameter: age`);
    if(!gender) message.push(`Missing parameter: gender`);
    if(!_.isEmpty(message)) return res.status(400).send({success:false, message: message});
    const user = await db_user.update_userinfo(email, height, weight, age, gender);
    
    if(user.status=="error") {
        return res.status(400).send({success: false, message: user.message});
    } else {
        return res.status(200).send({success: true, message: user.message});
    }   
});

app.get('/v1/getuserallergies', async (req,res) => {
    const email = null ?? req.query.email;
    if(!email) return res.status(400).send({success: false, message:`Missing parameter: email`});

    const user = await db_user.get_userallergies(email);
    
    if(user.status=="error") {
        return res.status(400).send({success: false, message: user.message});
    } else {
        return res.status(200).send({success: true, message: user.message, data: user.data});
    }   
});

app.post('/v1/updateuserallergies', async (req,res) => {
    const message = [];
    const email = null ?? req.body.email;
    const allergies = null ?? req.body.allergies;
    if(!email) message.push(`Missing parameter: email`);
    if(!allergies || _.isEmpty(allergies)) message.push(`Missing parameter: allergies`);
    if(!_.isEmpty(message)) return res.status(400).send({success:false, message: message});
    
    
    const user = await db_user.update_userallergies(email, allergies);

    if(user.status=="error") {
        return res.status(400).send({success: false, message: user.message});
    } else {
        return res.status(200).send({success: true, message: user.message});
    }   
});

app.post('/v1/adduser', async (req,res) => {
    const email = null ?? req.body.email;
    const name = req.body.name ?? "Unnamed";
    if(!email) return res.status(400).send({success: false, message:`Missing parameter: email`});

    const user = await db_user.create_user(email, name);
    
    if(user.status=="error") {
        return res.status(400).send({success: false, message: user.message});
    } else {
        return res.status(200).send({success: true, message: user.message});
    }   
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
