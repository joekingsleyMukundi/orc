// jshint esversion:8
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogDashSchema = new Schema({
  user:{
    type: String,
    required: true,
    unique:true
  },
  revenue:{
    type:Number,
    default:0 
  },
  balance:{
    type:Number,
    default:0
  },
},
{ timestamps: true });
const BlogDashboard = new mongoose.model('BlogDashboard',blogDashSchema);
module.exports= BlogDashboard;