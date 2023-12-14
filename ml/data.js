import 'dotenv/config';
import fs from 'fs';
import csvParser from 'csv-parser';
import _ from 'lodash';
import {images_list, images_get_public_url} from '../cloudstorage/main.js';


const foodData_path = './ml/dataset_final.csv';

const foods = [];
const allergens = [];

await images_list();
await fs.createReadStream(foodData_path)
    .pipe(csvParser())
    .on('headers', (headers) => {
        headers
        .slice(10)
        .map((val, idx) => allergens.push( 
            {
                id: idx,
                allergen_name: val,
                allergen_name_clean: _.startCase(val.replace('_', ' '))
            }
        ));
    })
    .on('data', (data) => {
        // Clean the name 
        let cleanName = data.nama_makanan.split(',')[0];
        cleanName = _.startCase(cleanName);
        data = {...data, nama_makanan_clean:cleanName}
        foods.push(data);
    })
    .on('end', () => {
        foods.forEach((val, index) =>{
            val['image_url'] = images_get_public_url(index);
        })
    });

export const getFoodbyId = function (id) {
    return foods.filter((val) => val.food_id == id);
}

export const getAllFood = function () {
    return foods;
}

export const getAllergenbyId = function (id) {
    return allergens.filter((val) => id == val.id || id == val.allergen_name)
}

export const getAllAllergen = function () {
    return allergens;
}
// == ML  ==
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
