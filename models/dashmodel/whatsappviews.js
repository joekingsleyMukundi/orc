const mongoose = require('mongoose');

const productViewSchema = new mongoose.Schema({
    user:{
    type: String,
    required: true,
  },
    productId: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    revenue: {
        type: Number,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const WhatsAppViews = new mongoose.model('ProductViews', productViewSchema);
module.exports = WhatsAppViews;
