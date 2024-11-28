const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL or path to the image
        required: true
    },
    content: {
        type: String,
        required: true
    },
    wordCount: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    revenue: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog
