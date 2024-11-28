// jshint esversion:8

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cryptoSchema = new Schema({
  user:{
    type: String,
    required: true,
    unique:true
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
},
{ timestamps: true });
const CryptoDash = new mongoose.model('CryptoDash',cryptoSchema);
module.exports= CryptoDash;