import mongoose from 'mongoose';

const collection = 'users';

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        index: true,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    trips:[]
})

const userModel = mongoose.model(collection, userSchema);

export default userModel;
// This file defines the user model for the application, including fields for email, password, first name, last name, and trips.