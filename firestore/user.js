import { db } from './main.js';
// import { Timestamp } from "firebase-admin/firestore";

const usersCollection = await db.collection('test_users');

export const findUserbyEmail = async function (email) {
    const res = await usersCollection.doc(email).get(); 
    if(!res.exists) return undefined;
    else return res; 
} 

export const create_user = async function (email, name) {
    try {
        const userExist = await findUserbyEmail(email); 
        if(userExist) return ({ status:"error", message: "User already exist"});

        const res = await usersCollection.doc(email).set({
            name: name,
            email: email,
            allergies: []
        });

        console.log(`User with email ${email} added. ID: ${res.id}`);
        return { status:"success", message: `User with email ${email} added. ID: ${res.id}`};
    } catch (error) {
        return { status: "error", message: error };
    }
}

export const get_user = async function (email) {
    try {
        const userExist = await findUserbyEmail(email);
        if (userExist) {
            const user = await userExist;

            return { status: "success", message: `Get user with email ${email} success. ID: ${user.id}`, data: user.data() };
        } else {
            return ({ status: "error", message: "User with that email does not exist" });
        }

    } catch (error) {
        return { status: "error", message: error };
    }
}


export const update_user = async function (email, object) {
    try {
        const userExist = await findUserbyEmail(email);
        
        if (userExist) {
            const user = userExist.ref;
            await user.update(object);
            return { status: "success", message: `Updated user with email ${email}. ID: ${user.id}` };
        } else {
            return { status: "error", message: "User with that email does not exist" };
        }
    } catch (error) {
        return { status: "error", message: error };
    }
}

export const get_userinfo = async function (email) {
    const res = await get_user(email);
    const user = await res.data;
    const userinfo = {
        height: user.height,
        weight: user.weight,
        age: user.age, 
        gender: user.gender,
        bmr: user.bmr
    };

    return {...res, data: userinfo};
}

export const update_userinfo = async function (email, height, weight, age, gender) {
    let bmr = 10*weight + 6.25* height - 5 * age;
    if(gender == 'm') bmr+=5;
    else bmr-=161;
    return await update_user(email, {height, weight, age, gender, bmr});
}

export const get_userallergies = async function (email) {
    const res = await get_user(email);
    const user = await res.data;

    return {...res, data: user.allergies};
}

export const update_userallergies = async function (email, allergies) { // array
    return update_user(email, {allergies});
}