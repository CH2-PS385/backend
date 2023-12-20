import { db } from './main.js';
const tracker = await db.collection('trackers');

export const get_intake = async function (email, dd, mm, yy) {
    try {
        const res = await tracker.doc(email).get();
        if (res.exists) {
            const tracker = res.data();
            if (tracker[`${yy}${mm}${dd}`]) {
                return { status: "success", isEmpty: false, message: `Intake for ${yy}${mm}${dd} (yymmdd) exists.`, array: tracker[`${yy}${mm}${dd}`] };
            }
            return { status: "success", isEmpty: true, message: `Intake for ${yy}${mm}${dd} (yymmdd) does not exists.`, array: [] };
        }
        return { status: "success", isEmpty: true, message: `Intake document is empty. `, array: [] };
    } catch (error) {
        return { status: "error", isEmpty: true, message: error };
    }
}

export const set_intake = async function (email, dd, mm, yy, intake) { // array of id
    try {
        if (!(await tracker.doc(email).get()).exists) tracker.doc(email).set({});
       
        const array = (await get_intake(email, dd, mm, yy)).array;
        array.push(intake);
        await tracker.doc(email).update({
            [`${yy}${mm}${dd}`]: array
        });
        // console.log('h');
        console.log(`Intake for ${yy}${mm}${dd} (yymmdd) added. Intake amount: ${intake}`);
        return { status: "success", message: `Intake for ${yy}${mm}${dd} (yymmdd) added. Intake amount: ${intake}`, array:array };

    } catch (error) {
        return { status: "error", message: error };
    }
}

