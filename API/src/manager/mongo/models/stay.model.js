import mongoose from "mongoose";

const collection = "Stays";

const staySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    starDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    checkin: {
        type: String,
        required: true,
        match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // Only allows values like "14:30"
    },
    checkout: {
        type: String,
        required: true,
        match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // Only allows values like "08:45"
    },
    location: {
        name: {
            type: String,
            required: true,
        },
        adress: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        mapUrl: {
            type: String,
            required: true,
        }
    },
    cost: {
        type: Number,
        default: 0,
    },
    paid: {
        type: Boolean,
        default: false,
    },
    booking: {
        data: Buffer,
        contentType: {
            type: String,
            enum: ['application/pdf', 'image/jpeg', 'image/png'],
        }
    },
    trip: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Trips',
        }],
});

const stayModel = mongoose.model(collection, staySchema);

export default stayModel;
// This file defines the stay model for the application, including fields for name, start date, end date, check-in and check-out times, location details, cost, payment status, and booking information.