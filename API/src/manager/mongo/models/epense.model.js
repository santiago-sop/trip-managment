import mongoose from "mongoose";

const collection = "Expenses";

const expenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    trip: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Trips',
        required: true,
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
});