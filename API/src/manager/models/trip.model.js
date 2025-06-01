import mongoose from "mongoose";

const collection = "trips";

const tripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    destination: {
        type: String,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    budget: {
        type: Number,
        default: 0,
    },
});

const tripModel = mongoose.model(collection, tripSchema);

export default tripModel;
// This file defines the trip model for the application, including fields for name, description, start date, end date, destination, participants, and budget.