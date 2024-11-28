// jshint esversion:8
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const whatsappdashSchema = new Schema({
  user:{
    type: String,
    required: true,
    unique:true
  },
  products:{
    type: Number,
    default:0
  },
  totalViewCount:{
    type:Number,
    default:0
  },
  revenue:{
    type:Number,
    default:0
  },
  activeBalance:{
    type:Number,
    default:0
  },
},
{ timestamps: true });
const WhatsAppDashboard = new mongoose.model('WhatsAppDashboard',whatsappdashSchema);
module.exports= WhatsAppDashboard;