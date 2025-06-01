import mongoose from "mongoose";

const collection = "activities";

const activitySchema = new mongoose.Schema({
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
    location: {
        type: String,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true,
    },
    cost: {
        type: Number,
        default: 0,
    },
    paid: {
        type: Boolean,
        default: false,
    },
});

const activityModel = mongoose.model(collection, activitySchema);

export default activityModel;
// This file defines the activity model for the application, including fields for name, description, date, location, participants, trip ID, cost, and payment status.