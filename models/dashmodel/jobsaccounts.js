// jshint esversion:8
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobsAccountsSchema = new Schema({
  name:{
    type: String,
  },
  buyer:{
    type: String,
  },
  location:{
    type:String,
  },
  subject:{
    type:String,
  },
  image:{
    type:String,
  },
  price:{
    type:Number,
    default:0
  },
  status:{
    type:String,
  },
},
{ timestamps: true });
const JobAccounts = new mongoose.model('JobsAccounts',jobsAccountsSchema);
module.exports= JobAccounts;