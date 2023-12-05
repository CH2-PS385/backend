import 'dotenv/config';
import fs from 'fs';
import csvParser from 'csv-parser';

const foodData_path = './ml/dataset_final.csv';

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
