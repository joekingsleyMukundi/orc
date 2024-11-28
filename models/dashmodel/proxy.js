const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const proxySchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    country: {
        type: String,
        required: true,
        enum: ['IN', 'UK', 'US', 'AR', 'AU', 'CA', 'MX'] // Allowed countries
    },
    proxyType: {
        type: String,
        required: true,
        enum: ['static_residential_ipv4']
    },
    duration: {
        type: Number,
        required: true,
        enum: [1, 3, 6] // Duration in months
    },
    amount: {
        type: Number,
        required: true
    },
    ip: {
        type: String,
        default: null // Admin will populate this once proxy is assigned
    },
    network: {
        type: String,
        default: null // e.g., network provider, populated by admin
    },
    connectionType: {
        type: String,
        default: 'SOCKS5' // Fixed type as per your requirement
    },
    expires: {
        type: Date,
        default: null // Admin can calculate based on duration
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Proxy = mongoose.model('Proxy', proxySchema);
module.exports = Proxy;
