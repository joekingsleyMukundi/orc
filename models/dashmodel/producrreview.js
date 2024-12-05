const mongoose = require('mongoose');

const productReviewSchema = new mongoose.Schema({
    
    filePath: {
        type: String,
        required: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const ProductReviews = new mongoose.model('ProductReviews', productReviewSchema);
module.exports = ProductReviews;
