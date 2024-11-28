// models/Wallet.js
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    totalBalance: {
        type: Number,
        required: true,
        default: 0
    },
    balances: {
        bitcoin: { type: Number, default: 0 },
        litecoin: { type: Number, default: 0 },
        ethereum: { type: Number, default: 0 }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
