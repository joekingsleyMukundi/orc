// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: { type: String, },
    cryptoType: { type: String, enum: ['BTC', 'ETH', 'LTC'], required: true },
    transactionType: { type: String, enum: ['buy', 'sell'], required: true },
    amount: { type: Number, required: true }, // Amount in cryptocurrency units  // Price in USD
    date: { type: Date, default: Date.now }
});
const CryptoTransaction = mongoose.model('CryptoTransaction', transactionSchema);
module.exports = CryptoTransaction
