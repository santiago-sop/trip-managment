import mongoose from "mongoose";

const collection = "Trips";

const tripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
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
    budget: {
        type: Number,
        default: 0,
    },
    participants: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Users',
        required: true,
    }],
    activities: [{
        name: String,
        description: String,
        date: Date,
        city: String,
        cost: {
            type: Number,
            default: 0,
        },
        paid: {
            type: Boolean,
            default: false,
        },
    }],
    stays:[{
        name: String,
        startDate: Date,
        endDate: Date,
        checkin: {
            type: String,
            match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // Only allows values like "14:30"
        },
        checkout: {
            type: String,
            match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // Only allows values like "08:45"
        },
        location: {
            name: String,
            adress: String,
            city: String,
            mapUrl: String,
        },
        cost: {
            type: Number,
            default: 0,
        },
        paid: {
            type: Number,
            default: 0,
        },
        booking: {
            data: Buffer,
            contentType: {
                type: String,
                enum: ['application/pdf', 'image/jpeg', 'image/png'],
            }
        },
    }],
    transfers:[{
        name: String,
        startDate: Date,
        endDate: Date,
        startLocation: String,
        endLocation: String,
        vehicle: {
            type: String,
            enum: ['Avion', 'Tren', 'Bus', 'Auto', 'Bicileta', 'Moto', 'Caminando']
        },
        startTime: {
            type: String,
            match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // Solo permite valores como "14:30"
        },
        endTime: {
            type: String,
            match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // Solo permite valores como "08:45"
        },
        location: {
            name: String,
            mapUrl: {
                type: String,
            }
        },
        cost: {
            type: Number,
            default: 0,
        },
        paid: {
            type: Number,
            default: 0,
        },
        booking: {
            data: Buffer,
            contentType: {
                type: String,
                enum: ['application/pdf', 'image/jpeg', 'image/png'],
            }
        },
    }],
    blog:[{
        title: String,
        content: String,
        date: {
            type: Date,
            default: Date.now,
        },
        photo: {
            data: Buffer,
            contentType: {
                type: String,
                enum: ['image/jpeg', 'image/png'],
            },
        },
    }],
    expenses:[{
        name: String,
        description: String,
        date: {
            type: Date,
            default: Date.now,
        },
        amount: Number,
        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
    }],

});

//tripSchema.pre(['find', 'findOne'], function() {
    //this.populate('participants');
//});

const tripModel = mongoose.model(collection, tripSchema);

export default tripModel;
// This file defines the trip model for the application, including fields for name, description, start date, end date, destination, participants, and budget.