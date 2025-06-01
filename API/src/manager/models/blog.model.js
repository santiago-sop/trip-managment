import mongoose from "mongoose";

const collection = "blogs";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
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
});

const blogModel = mongoose.model(collection, blogSchema);

export default blogModel;
// This file defines the blog model for the application, including fields for title, content, date, and an optional photo.