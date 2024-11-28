const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    user:{
        type: String,
        required: true,
    },
    Billingname:{
        type: String,
        required: true,
    },
    Amount:{
        type: Number,
        required: true,
    },
    Phone:{
        type: String,
        required: true,
    },
    Transactioncode:{
        type:String,
        required:true,
    },
    Status:{
        type: String,
        required: true,
    },
    Paymentmethod:{
        type: String,
        required: true,
    },
    Transactiontype:{
        type: String,
        required: true,
    },
    Transactionmodule:{
        type: String,
        required: true,
    },
},
{ timestamps: true });

const Transaction = new mongoose.model('Transaction',transactionSchema);
module.exports = Transaction ;