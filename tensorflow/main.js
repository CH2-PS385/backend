// TensorflowJS
import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import csvParser from 'csv-parser';
import 'dotenv/config'

const models_path = process.env.URL_TFMODELJSON;
const foodData_path = './tensorflow/dataset_final.csv';

const foods = [];

fs.createReadStream(foodData_path)
    .pipe(csvParser())
    .on('data', (data) => foods.push(data))
    .on('end', () => {
    });

export const getFoodbyId = function (id) {
    return foods.filter((val) => val.food_id == id);
}

// Get the kalori value from the food_id
export const getCalories = function (id) {
    let calories = parseInt(foods[id - 1].kalori)
    return calories;
}

// Check each allergies value from the food_id
export const getAllergies = function (id, allergy) {
    return foods[id - 1][allergy];
}

// Get the tipe value from the food_id
export const getTypeFood = function (id) {
    return foods[id - 1].tipe;
}

export async function recommendation(userCalories, allergies) {
    // Load model
    const model = await tf.loadLayersModel(models_path);

    // Generate id_foods
    const id_foods = Array.from({ length: 151 }, (_, i) => i + 1);
    // Generate random id_users
    const tmp_id_users = Math.floor(Math.random() * 151) + 1;
    const id_users = Array(id_foods.length).fill(tmp_id_users);

    const idUsersTensor = tf.tensor2d(id_users, [id_users.length, 1]);
    const idFoodsTensor = tf.tensor2d(id_foods, [id_foods.length, 1]);

    // Predict
    const predictionsTensor = model.predict([idUsersTensor, idFoodsTensor]);
    const predictions = await predictionsTensor.array();

    // Get the prediction values
    const predictionValues = predictions.map(a => a[0]);

    // Get the index of recommended food ids
    const recommendedFoodIds = predictionValues.map((value, index) => ({ value, index }))
        .sort((a, b) => b.value - a.value)
        .map(item => item.index);

    // add 1 to each food id
    recommendedFoodIds.forEach((value, index) => recommendedFoodIds[index] = value + 1);

    // Drop recommendedFoodIds that contain allergies
    if (allergies.length > 0) {
        for (const allergy of allergies) {
            for (const food of recommendedFoodIds) {
                if (getAllergies(food, allergy) == 1) {
                    recommendedFoodIds.splice(recommendedFoodIds.indexOf(food), 1);
                }
            }
        }
    }

    let nonSnackIds = [];
    let snackIds = [];

    // Split recommendedFoodIds into 2 arrays: nonSnackIds and snackIds
    for (const food of recommendedFoodIds) {
        if (getTypeFood(food) == 'Makanan Berat') {
            nonSnackIds.push(food);
        }
        else {
            snackIds.push(food);
        }
    }

    const comb_4 = [];
    let temp = 0;

    // Generate combinations of 3 non-snack foods and 1 snack food
    // comb_4 array contain [[breakfast, lunch, dinner, snack, total calories], ...]]
    for (let i = 0; i < nonSnackIds.length - 2; i++) {
        for (let j = i + 1; j < nonSnackIds.length - 1; j++) {
            for (let k = j + 1; k < nonSnackIds.length; k++) {
                for (let l = 0; l < snackIds.length; l++) {
                    temp = getCalories(nonSnackIds[i]) + getCalories(nonSnackIds[j]) + getCalories(nonSnackIds[k]) + getCalories(snackIds[l]);
                    if (temp <= userCalories) {
                        comb_4.push([nonSnackIds[i], nonSnackIds[j], nonSnackIds[k], snackIds[l], temp]);
                    }
                }
            }
        }
    }

    // Sort comb_4 by total calories
    comb_4.sort((a, b) => b[4] - a[4]);

    // Pick random 1 combinations from top 7 arrays from comb_4
    const randomNumber = Math.floor(Math.random() * 7) + 1;

    // Get the choosen food ids
    const choosenFoodIds = comb_4[randomNumber - 1];

    return choosenFoodIds;
}
