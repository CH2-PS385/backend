// Cloud Storage
import fs from 'fs';
import csvParser from 'csv-parser';
import 'dotenv/config';

const images_list_name_data = './cloudstorage/images_list_name.csv';
const images_list_name = [];

export async function images_list() {
    await fs.createReadStream(images_list_name_data)
    .pipe(csvParser())
    .on('headers', () => {})
    .on('data', (data) => images_list_name.push(data.nama_file))
    .on('end', () => {});
}

export function images_get_public_url(index){
    return process.env.URL_FOOD_IMAGES+images_list_name[index];
}