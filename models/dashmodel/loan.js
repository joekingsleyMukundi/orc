// models/Loan.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loanSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['processing', 'approved', 'rejected'],
        default: 'processing'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Loan = mongoose.model('Loan', loanSchema);
module.exports = Loan;
