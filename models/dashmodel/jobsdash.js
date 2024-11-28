//// jshint esversion:8
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobsdashSchema = new Schema({
  user:{
    type: String,
    required: true,
    unique:true
  },
  accounts:[{
    type: String,
  }],
  paccounts:[{
    type: String,
  }],
},
{ timestamps: true });
const JobsDashboard = new mongoose.model('JobsDashboard',jobsdashSchema);
module.exports= JobsDashboard;
