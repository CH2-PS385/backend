import { db } from './main.js';
import { Timestamp } from "firebase-admin/firestore";

const usersCollection = await db.collection('test_users');

export const findUserbyEmail = async function (email) {
    const res = await usersCollection.where('email','==',email).get();
    // console.log(res.empty);
    if(res.empty) return undefined;
    else return res; 
} 

export const create_user = async function (email, name) {
    try {
        const userExist = await findUserbyEmail(email); 
        if(userExist) return ({ status:"error", message: "User already exist"});

        const res = await usersCollection.add({
            name: name,
            email: email
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
            const user = await userExist.docs[0].data();

            return { status: "success", message: `Get user with email ${email} success. ID: ${user.id}`, data: user };
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
            const user = userExist.docs[0].ref;
            await user.update(object);
            return { status: "success", message: `Updated user with email ${email}. ID: ${user.id}` };
        } else {
            return { status: "error", message: "User with that email does not exist" };
        }
    } catch (error) {
        return { status: "error", message: error };
    }
}