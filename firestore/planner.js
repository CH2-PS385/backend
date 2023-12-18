import { db } from './main.js';
// import { Timestamp } from "firebase-admin/firestore";

const planner = await db.collection('test_planners');

export const set_planner = async function (email, dd, mm, yy, array) { // array of id
    
    try {
        if(!(await planner.doc(email).get()).exists) planner.doc(email).set({});
        await planner.doc(email).update({
            [`${yy}${mm}${dd}`]: array
        });

        console.log(`Planner for ${yy}${mm}${dd} (yymmdd) added. IDs: ${array}`);
        return { status: "success", message: `Planner for ${yy}${mm}${dd} (yymmdd) added. IDs: ${array}` };
        
    } catch (error) {
        return { status: "error", message: error };
    }
}

export const get_planner = async function (email, dd, mm, yy) {
    try {
        const res = await planner.doc(email).get();
        if (res.exists) {
            const planner = res.data();
            if(planner[`${yy}${mm}${dd}`]){
                return { status: "success", isEmpty: false, message: `Planner for ${yy}${mm}${dd} (yymmdd) exists.`, array: planner[`${yy}${mm}${dd}`] };
            }
            return { status: "success",  isEmpty: true,message: `Planner for ${yy}${mm}${dd} (yymmdd) does not exists.`, array: undefined };
        } 
        return { status: "success",  isEmpty: true, message: `Planner is empty. `, array: undefined };
    } catch (error) {
        return { status: "error",isEmpty: true, message: error };
    }
}



