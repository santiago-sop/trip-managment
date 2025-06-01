import mongoose from "mongoose";

const collection = "transfers";

const transferSchema = new mongoose.Schema({
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
    starLocation: {
        type: String,
        required: true,
    },
    endLocation: {
        type: String,
        required: true,
    },
    starTime: {
        type: String,
        required: true,
        match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // Solo permite valores como "14:30"
    },
    endTime: {
        type: String,
        required: true,
        match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // Solo permite valores como "08:45"
    },
    location: {
        name: {
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
    }
});

const transferModel = mongoose.model(collection, transferSchema);

export default transferModel;
// This file defines the transfer model for the application, including fields for name, start date, end date, start location, end location, start time, end time, cost, payment status, and booking information.